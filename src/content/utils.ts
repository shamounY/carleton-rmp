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