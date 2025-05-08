import { getProfessorRating, determineRatingColour, generateStarRating } from "./utils";

const professorCells = document.querySelectorAll('td[width="9%"]:last-child');

//do a for each loop and get names from that, then call the get rating
professorCells.forEach(async prof => {
    const profName = prof.textContent?.trim();
    if (!profName || profName === "Instructor") {
        return
    }
    
    const originalContent = prof.innerHTML;

    const profInfo = await getProfessorRating(profName)
    
    if (profInfo) {
        const rating = profInfo.avgRating;
        
        const ratingColour = determineRatingColour(rating);
        const stars = generateStarRating(rating);
        
        prof.innerHTML = `
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
                        background-color: #fff;
                        color: #333;
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
                                background-color: #eee;
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
                                background-color: #eee;
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
                                background-color: #eee;
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

                        <div style="border-top: 1px solid #eee; margin: 8px 0;"></div>

                        <div style="font-size: 10px">Based on </strong> ${profInfo.numRatings ?? "N/A"} rating(s)</div>
                        <div style="font-size: 10px; text-align: center; margin-top: 5px;">
                            <a href="https://www.ratemyprofessors.com/professor/${profInfo.legacyId}" target="_blank" style="color: #0066cc; text-decoration: none; font-weight: 500;">
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
                            border-left: 8px solid #fff;
                        "></div>
                    </div>
                </div>
        `;

        const tooltip = prof.querySelector(".tooltip-container");
        const tooltipText = prof.querySelector(".tooltip") as HTMLElement;

        if (tooltip && tooltipText) {
            let hideTimeout: ReturnType<typeof setTimeout>;
        
            const showTooltip = () => {
                clearTimeout(hideTimeout);
                tooltipText.style.visibility = "visible";
                tooltipText.style.opacity = "1";
            };
        
            const hideTooltip = () => {
                hideTimeout = setTimeout(() => {
                    tooltipText.style.visibility = "hidden";
                    tooltipText.style.opacity = "0";
                }, 300);
            };
        
            tooltip.addEventListener("mouseenter", showTooltip);
            tooltip.addEventListener("mouseleave", hideTooltip);
        }        
    }

    else {
        console.log("NA")
        prof.innerHTML = `
            ${originalContent}
            <br/>
            <span style="font-size: smaller; color: black;">Rating: N/A</span>
        `;
    }
})
