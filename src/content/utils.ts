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
 * Removes the profs middle name if they have one.
 * @param name - The profs fullname.
 * @returns - The first and last name of the prof.
 */
export const remmoveMiddleName = (name : string) => {
    const nameParts = name.split(" ");
    const profName = nameParts.length > 2 ? 
        `${nameParts[0]} ${nameParts[nameParts.length - 1]}` :
        name;
    return profName
}

/**
 * Determines the color to display for a given rating value.
 * @param rating - The numerical rating value (1.0 to 5.0)
 * @returns A string representing the color to use ('red', 'orange', 'green', or 'black')
 */
export const determineRatingColour = (rating : number) => {
    let ratingColour = "black";
    if (rating >= 0 && rating <= 2.4) {
        ratingColour = "red";
    } else if (rating >= 2.5 && rating <= 3.4) {
        ratingColour = "darkorange"; 
    } else if (rating >= 3.5 && rating <= 3.9) {
        ratingColour = "orange"
    } else if (rating >= 4.0 && rating <= 5.0) {
        ratingColour = "green";
    }
    return ratingColour 
};

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
        starsHTML += '<span class="star star-full">★</span>';
    }
    
    // Add partial star if needed
    if (partialStar > 0) {
        const percentage = Math.round(partialStar * 100);
        starsHTML += `<span class="star-partial">
                        <span class="star-partial-empty">★</span>
                        <span class="star-partial-fill" style="width: ${percentage}%">★</span>
                        </span>`;
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star star-empty">★</span>';
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
    const themeClass = isDark ? 'dark-mode' : 'light-mode';

    return `
        ${originalContent}
        <br/>
        <div class="tooltip-container ${themeClass}">
            <span class="rating-badge" style="background-color: ${ratingColour}">
                ${profInfo.avgRating}
            </span>
            <div class="tooltip">
                <div class="tooltip-title">${profName}</div>
                
                <div class="tooltip-stars">${stars}</div>
            
                <div class="tooltip-metric">
                    <div class="tooltip-metric-header">
                        <span class="tooltip-metric-label">Difficulty</span>
                        <span>${profInfo.avgDifficulty ?? "N/A"}</span>
                    </div>
                    <div class="tooltip-progress-bar">
                        <div class="tooltip-progress-fill" style="width: ${profInfo.avgDifficulty ? (profInfo.avgDifficulty / 5) * 100 : 0}%; background-color:rgb(255, 0, 144);"></div>
                    </div>
                </div>

                <div class="tooltip-metric">
                    <div class="tooltip-metric-header">
                        <span class="tooltip-metric-label">Would Take Again</span>
                        <span>${Math.round(profInfo.wouldTakeAgainPercent) ?? "N/A"}%</span>
                    </div>
                    <div class="tooltip-progress-bar">
                        <div class="tooltip-progress-fill" style="width: ${profInfo.wouldTakeAgainPercent ?? 0}%; background-color: #2196F3;"></div>
                    </div>
                </div>

                <div class="tooltip-divider"></div>

                <div class="tooltip-footer">Based on ${profInfo.numRatings ?? "N/A"} rating(s)</div>
                <div class="tooltip-link">
                    <a href="https://www.ratemyprofessors.com/professor/${profInfo.legacyId}" target="_blank">
                        View on RateMyProfessors
                    </a>
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        </div>
    `;
};