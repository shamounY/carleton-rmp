import ratings from '@mtucourses/rate-my-professors';

/**
 * Base64 encoded school ID for Carleton University.
 * @type {string}
 */
const SCHOOL_ID = "U2Nob29sLTE0MjA=";

/**
 * Checks if the teacher's name matches the searched professor name
 * @param {string} profName - The name of the professor being searched
 * @param {Object} teacher - The teacher object from the search results
 * @returns {boolean} - True if names match, false otherwise
 */
function isMatchingProfessor(profName: string, teacher: { firstName: string; lastName: string }): boolean {
    const teacherFullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return teacherFullName === profName.toLowerCase();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "fetchRating") {
        const profName = request.prof;
        
        chrome.storage.local.get(profName).then(async (result) => {
            if (result[profName] === undefined) { 
                ratings.searchTeacher(profName, SCHOOL_ID).then(teachers => {
                    if (teachers.length === 0) {
                        sendResponse(null);
                        return;
                    }

                    if (!isMatchingProfessor(profName, teachers[0])) {
                        sendResponse(null);
                        return;
                    }

                    ratings.getTeacher(teachers[0].id).then(profInfo => {
                        chrome.storage.local.set({ [profName] : profInfo });
                        sendResponse(profInfo);
                    });
                }).catch(() => sendResponse(null));
            }
            else {
                console.log("im in the else for ", profName);
                sendResponse(result[profName]);
            }
        });
        return true;
    }
});