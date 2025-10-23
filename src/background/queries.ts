import { AUTH_TOKEN, URL } from "./constants"
import { SCHOOL_IDS } from './constants';
import { jaroWinkler } from "jaro-winkler-typescript";
/**
 * Checks if the teacher's name matches the searched professor name
 * @param {string} profName - The name of the professor being searched
 * @param {Object} teacher - The teacher object from the search results
 * @returns {boolean} - True if names match, false otherwise
 */

const isMatchingProfessor = (profName: string, teacher: {firstName: string, lastName: string}): boolean => {
    // Normalize both names by removing extra spaces, accents, and special characters
    const normalizeString = (str: string): string => {
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')  // Replace dashes with spaces to separate hyphenated names
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Get first, last, and potentially middle names from both sources
    const profNameNormalized = normalizeString(profName);    
    const teacherFullName = normalizeString(teacher.firstName + " " + teacher.lastName);

    // TODO: ADD A STRING SIMILARITY TO COMPARE NAMES AND ACCEPT GREATHER THAN 0.85?
    
    // If names match exactly after normalization, return true
    if (teacherFullName === profNameNormalized) return true;
    
    // Split names into parts
    const profParts = profNameNormalized.split(' ');
    const teacherParts = teacherFullName.split(' ');
    
    // If first and last names match, consider it a match regardless of middle names
    if ((profParts.length > 0 && teacherParts.length > 0) && 
        (profParts[0] === teacherParts[0] && 
        profParts[profParts.length-1] === teacherParts[teacherParts.length-1]) 

        // Check if order of names are switched
        || (profParts[0] === teacherParts[teacherParts.length-1]) && profParts[profParts.length-1] === teacherParts[0]) {
        return true;
    }
    
    // Check similarity between names since there can be spelling variations between rmp and course page
    const firstAsLastSimilarity = jaroWinkler(profParts[0], teacherParts[0]);
    const lastAsFirstSimilarity = jaroWinkler(profParts[profParts.length - 1], teacherParts[teacherParts.length - 1]);

    if (firstAsLastSimilarity >= 0.95 && lastAsFirstSimilarity >= 0.95) {
        return true;
    }

    // If we get here, names don't match
    return false;
}

interface ITeacherFromSearch {
    id: string;
    firstName: string;
    lastName: string;
    school: {
        id: string;
        name: string;
    };
};

export interface ITeacherPage {
    id: string;
    firstName: string;
    lastName: string;
    avgDifficulty: number;
    numRatings: number;
    department: string;
    school: {
        id: string;
        name: string;
    };
    legacyId: number;
};

// Query to find teachers
export const getTeacherID = async (name: string) => {    
    
    // Loop through all school ids
    for (let schoolID of SCHOOL_IDS) {        
        const response = await fetch(URL, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
            query: `query NewSearchTeachersQuery($text: String!, $schoolID: ID!) {
                newSearch {
                    teachers(query: {text: $text, schoolID: $schoolID}) {
                        edges {
                        cursor
                        node {
                            id
                            firstName
                            lastName
                            school {
                            name
                            id
                            }
                        }
                        }
                    }
                }
            }`,
            variables: {
                text: name,
                schoolID,
            },
            }),
        });
        const json = await response.json();
        if (json.data.newSearch.teachers.edges.length > 0) {

            const teachers = json.data.newSearch.teachers.edges.map((edge: { node: ITeacherFromSearch }) => edge.node);
            const matchingTeacher = teachers.find((teacher: ITeacherPage) => 
                isMatchingProfessor(name, teacher)
            );

            if (matchingTeacher) {
                return matchingTeacher.id
            }            
        }        
    }      
    return null;
}

// Query to get teacher data
export const getTeacher = async (id: string) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          query: `query TeacherRatingsPageQuery($id: ID!) {
            node(id: $id) {
              ... on Teacher {
                id
                firstName
                lastName
                school {
                  name
                  id
                  city
                  state
                }
                avgDifficulty
                avgRating
                department
                numRatings
                legacyId
                wouldTakeAgainPercent
              }
              id
            }
          }`,
          variables: {
            id,
          },
        }),
      });
      const json = await response.json();
      return json.data.node;
}
