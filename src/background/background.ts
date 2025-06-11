import { getTeacherID, getTeacher, ITeacherPage } from './queries';

/**
 * Cache expiration time in milliseconds (7 Days)
 */
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Dictionary of common name variations (formal name -> nickname/shortened name)
 */
const NAME_VARIATIONS: Record<string, string[]> = {
    "christopher": ["chris"],
    "michael": ["mike"],
    "robert": ["rob", "bob"],
    "william": ["will", "bill"],
    "thomas": ["tom"],
    "nicholas": ["nick"],
    "richard": ["rick"],
    "matthew": ["matt"],
    "jonathan": ["jon", "john"],
    "joseph": ["joe"],
    "benjamin": ["ben"],
    "samuel": ["sam"],
    "alexander": ["alex"],
    "katherine": ["kate", "kathy"],
    "elizabeth": ["liz", "beth"],
    "jennifer": ["jen"],
    "margaret": ["meg", "maggie"],
    "shelley": ["shelly"],
    "kimberley": ["kim"],
    "patrick": ["pat"],
    "masako": ["mako"],
    "joshua": ["josh"],
    "frederick": ["fred"]
};

/**
 * Checks if cached data is still valid
 * @param {Object} cachedData - The cached data object
 * @returns {boolean} - True if cache is valid, false otherwise
 */
const isCacheValid = (cachedData: { timestamp: number; data: any }): boolean => {
    return cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION;
}

/**
 * Gets possible name variations for a professor's name
 * @param {string} profName - The full name of the professor
 * @returns {string[]} - Array of possible name variations
 */
const getNameVariations = (profName: string): string[] => {
    const nameParts = profName.toLowerCase().split(' ');
    if (nameParts.length < 2) return [profName];
    
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const variations: string[] = [];

    // Check if we have variations for this first name
    if (NAME_VARIATIONS[firstName]) {
        // Add each variation with the last name
        NAME_VARIATIONS[firstName].forEach(variation => {
            variations.push(`${variation} ${lastName}`);
        });
    }

    // Check if the first name is a variation of a formal name
    for (const [formalName, nicknames] of Object.entries(NAME_VARIATIONS)) {
        if (nicknames.includes(firstName)) {
            variations.push(`${formalName} ${lastName}`);
        }
    }
    return variations;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "fetchRating") {
        const profName = request.prof;
        
        chrome.storage.local.get(profName).then(async (result) => {
            const cachedData = result[profName];
            
            if (cachedData && isCacheValid(cachedData)) {                
                sendResponse(cachedData.data);
                return;
            }

            // Try with original name first
            const searchAndRespond = async (nameToSearch: string) => {
                try {
                    const teacherID = await getTeacherID(nameToSearch);

                    // If no matching teacher found, return null
                    if (!teacherID) {
                        return null;
                    }
            
                    const profInfo = await getTeacher(teacherID);
                    const dataToCache = {
                        timestamp: Date.now(),
                        data: profInfo
                    };
                    chrome.storage.local.set({ [profName]: dataToCache });
                    return profInfo;
                } catch {
                    return null;
                }
            };

            let profResult = await searchAndRespond(profName);
            
            // If original name search failed, try variations
            if (!profResult) {
                const variations = getNameVariations(profName);
                
                for (const variation of variations) {
                    profResult = await searchAndRespond(variation);
                    if (profResult) break;
                }
            }
            sendResponse(profResult);
        });
        return true;
    }
});