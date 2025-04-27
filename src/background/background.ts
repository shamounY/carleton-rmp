import { SCHOOL_ID } from '../constants';
import ratings from '@mtucourses/rate-my-professors';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "fetchRating") {
        const profName = request.prof;
        
        chrome.storage.local.get(profName).then(async (result) => {
            if (result[profName] === undefined) { 
                console.log("im not in the else")
                ratings.searchTeacher(profName, SCHOOL_ID).then(teachers => {
                    if (teachers.length === 0) {
                        sendResponse(null);
                        return;
                    }
                    //console.log("array for the teachers: ", teachers)
                    ratings.getTeacher(teachers[0].id).then(rating => {
                        chrome.storage.local.set({ [profName] : rating });
                        sendResponse(rating);
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