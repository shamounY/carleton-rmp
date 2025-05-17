/**
 * Fetches the rating for a professor by sending a message to the Chrome extension runtime.
 * @param profName - The name of the professor to fetch the rating for
 * @returns A Promise that resolves to the professor's rating
 */
export const getProfessorRating = async (profName : string) => {
    const rating = await chrome.runtime.sendMessage({
        action : "fetchRating",
        prof : profName,
    });
    return rating;
};

/**
 * Determines the color to display for a given rating value.
 * @param rating - The numerical rating value (1.0 to 5.0)
 * @returns A string representing the color to use ('red', 'orange', 'green', or 'black')
 */
export const determineRatingColour = (rating : number) => {
    let ratingColour = "black";
    if (rating >= 1.0 && rating <= 2.5) {
        ratingColour = "red";
    } else if (rating > 2.5 && rating <= 3.9) {
        ratingColour = "orange"; 
    } else if (rating > 3.9 && rating <= 5.0) {
        ratingColour = "green";
    }
    return ratingColour
};

//test change for commmit with ssh

/**
 * Generates HTML for a star rating display based on a numerical rating.
 * Creates a visual representation with full stars (★), partial stars, and empty stars.
 * @param rating - The numerical rating value (1.0 to 5.0)
 * @returns A string containing HTML markup for the star rating display
 */
export const generateStarRating = (rating : number) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span style="color: gold; font-size: 22px">★</span>';
    }
    
    // Add partial star if needed
    if (partialStar > 0) {
        // Calculate width percentage for the partial star
        const percentage = Math.round(partialStar * 100);
        starsHTML += `<span style="position: relative; display: inline-block; font-size: 22px">
                        <span style="color: #ccc;">★</span>
                        <span style="position: absolute; top: 0; left: 0; overflow: hidden; width: ${percentage}%;">
                            <span style="color: gold;">★</span>
                        </span>
                        </span>`;
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span style="color: #ccc; font-size: 22px">★</span>';
    }

    return starsHTML;
};

/**
 * Detects if dark mode is enabled based on user preference or system settings
 * @returns {Promise<boolean>} True if dark mode is enabled
 */
export const isDarkMode = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['themePreference'], (result) => {
            if (result.themePreference !== undefined) {
                resolve(result.themePreference === 'dark');
            } else {
                resolve(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        });
    });
};

/**
 * Creates HTML for a professor's rating badge and tooltip with all relevant information.
 * @param profName - The name of the professor
 * @param profInfo - The professor's rating information
 * @param originalContent - The original content of the professor cell
 * @returns A string containing HTML markup for the rating badge and tooltip
 */
export const createProfessorRatingHTML = async (
    profName: string,
    profInfo: any,
    originalContent: string
) => {
    const rating = profInfo.avgRating;
    const ratingColour = determineRatingColour(rating);
    const stars = generateStarRating(rating);
    const isDark = await isDarkMode();

    return `
        ${originalContent}
        <br/>
        <div class="tooltip-container" style="display: inline-block; position: relative;">
            <span style="
                background-color: ${ratingColour};
                color: white;
                border-radius: 6px;
                padding: 4px 8px;
                min-width: 15px;
                height: 22px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: default;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                ${profInfo.avgRating}
            </span>
            <div class="tooltip" style="
                visibility: hidden;
                background-color: ${isDark ? '#1a1a1a' : '#fff'};
                color: ${isDark ? '#fff' : '#333'};
                text-align: center;
                border-radius: 8px;
                padding: 12px;
                position: absolute;
                z-index: 1;
                top: 50%;
                right: 125%;
                transform: translateY(-50%);
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
                white-space: nowrap;
                font-size: 12px;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">${profName}</div>
                
                <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>
                
                <div style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 500;">Rating</span>
                        <span>${profInfo.avgRating}/5.0</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 8px;
                        background-color: ${isDark ? '#333' : '#eee'};
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${(profInfo.avgRating / 5) * 100}%;
                            height: 100%;
                            background-color: #4CAF50;
                            border-radius: 4px;
                        "></div>
                    </div>
                </div>

                <div style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 500;">Difficulty</span>
                        <span>${profInfo.avgDifficulty ?? "N/A"}</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 8px;
                        background-color: ${isDark ? '#333' : '#eee'};
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${profInfo.avgDifficulty ? (profInfo.avgDifficulty / 5) * 100 : 0}%;
                            height: 100%;
                            background-color: #FF9800;
                            border-radius: 4px;
                        "></div>
                    </div>
                </div>

                <div style="margin: 12px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 500;">Would Take Again</span>
                        <span>${Math.round(profInfo.wouldTakeAgainPercent) ?? "N/A"}%</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 8px;
                        background-color: ${isDark ? '#333' : '#eee'};
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${profInfo.wouldTakeAgainPercent ?? 0}%;
                            height: 100%;
                            background-color: #2196F3;
                            border-radius: 4px;
                        "></div>
                    </div>
                </div>

                <div style="border-top: 1px solid ${isDark ? '#333' : '#eee'}; margin: 8px 0;"></div>

                <div style="font-size: 10px">Based on </strong> ${profInfo.numRatings ?? "N/A"} rating(s)</div>
                <div style="font-size: 10px; text-align: center; margin-top: 5px;">
                    <a href="https://www.ratemyprofessors.com/professor/${profInfo.legacyId}" target="_blank" style="color: ${isDark ? '#66b3ff' : '#0066cc'}; text-decoration: none; font-weight: 500;">
                        View on RateMyProfessors
                    </a>
                </div>
                <div style="
                    position: absolute;
                    top: 50%;
                    right: -8px;
                    margin-top: -8px;
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-left: 8px solid ${isDark ? '#1a1a1a' : '#fff'};
                "></div>
            </div>
        </div>
    `;
};