import ratings from '@mtucourses/rate-my-professors';

/**
 * Base64 encoded school ID for Carleton University.
 * @type {string}
 */
const SCHOOL_ID = "U2Nob29sLTE0MjA=";

/**
 * Cache expiration time in milliseconds (1 month)
 */
const CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;

/**
 * Checks if the teacher's name matches the searched professor name
 * @param {string} profName - The name of the professor being searched
 * @param {Object} teacher - The teacher object from the search results
 * @returns {boolean} - True if names match, false otherwise
 */
const isMatchingProfessor = (profName: string, teacher: {firstName: string, lastName: string}): boolean => {
    const teacherFullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return teacherFullName === profName.toLowerCase();
}

/**
 * Checks if cached data is still valid
 * @param {Object} cachedData - The cached data object
 * @returns {boolean} - True if cache is valid, false otherwise
 */
const isCacheValid = (cachedData: { timestamp: number; data: any }): boolean => {
    return cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION;
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

            if (cachedData === undefined || !isCacheValid(cachedData)) { 
                ratings.searchTeacher(profName, SCHOOL_ID).then(teachers => {
                    if (teachers.length === 0) {
                        sendResponse(null);
                        return;
                    }

                    // TODO: CHECK ALL TEACHERS AND CHOOSE ONE THAT HAS SAME FIRST AND LAST NAME
                    // IGNORE TODO???

                    if (!isMatchingProfessor(profName, teachers[0])) {
                        sendResponse(null);
                        return;
                    }

                    ratings.getTeacher(teachers[0].id).then(profInfo => {
                        const dataToCache = {
                            timestamp: Date.now(),
                            data: profInfo
                        };
                        chrome.storage.local.set({ [profName]: dataToCache });
                        sendResponse(profInfo);
                    });
                }).catch(() => sendResponse(null));
            }
        });
        return true;
    }
});