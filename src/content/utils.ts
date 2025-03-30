export const getProfessorRating = async (profName : string) => {
    const rating = await chrome.runtime.sendMessage({
        action : "fetchRating",
        prof : profName,
    });
    
    return rating;
};