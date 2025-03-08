import ratings from '@mtucourses/rate-my-professors';
import { SCHOOL } from '../constants';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "fetchRating") {
        const profName = request.prof;

        // Get the profs ratings
        chrome.storage.local.get([profName]).then(async (result) => {
            if (result[profName] === undefined) { 
                ratings.searchTeacher(profName, SCHOOL).then(teachers => {
                    if (teachers.length === 0) {
                        sendResponse({ rating : null });
                        return;
                    }
                    ratings.getTeacher(teachers[0].id).then(rating => {
                        chrome.storage.local.set({ [profName]:rating });
                        sendResponse({ rating : rating });
                    });
                }).catch(() => sendResponse({ rating : null }));
            }
            else {
                sendResponse({ rating : result[profName] });
            }
        });
        return true;
    }
});