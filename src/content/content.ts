import { getProfessorRating } from "./utils";

const professorCells = document.querySelectorAll('td[width="9%"]:last-child');

//do a for each loop and get names from that, then call the get rating
professorCells.forEach(async prof => {
    const profName = prof.textContent?.trim();
    if (!profName || profName === "Instructor") {
        return
    }
    
    const originalContent = prof.innerHTML;

    const profRating = await getProfessorRating(profName)
    if (profRating) {
        console.log(`Rating for ${profName}: ${profRating.avgRating}`);

        //determine color based on rating value
        let ratingColor = "black";
        const rating = profRating.avgRating;
        
        if (rating >= 1.0 && rating <= 2.5) {
            ratingColor = "red";
        } else if (rating > 2.5 && rating <= 3.5) {
            ratingColor = "orange"; 
        } else if (rating > 3.5 && rating <= 5.0) {
            ratingColor = "green";
        }

        prof.innerHTML = `
            ${originalContent}
            <br/>
            <div class="tooltip-container" style="display: inline-block; position: relative;">
                <span style="
                    background-color: ${ratingColor};
                    
                    color: white;
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    font-size: 11px;
                    font-weight: bold;
                    display: inline-block;
                    cursor: default;
                ">
                    ${profRating.avgRating}
                </span>
                   <div class="tooltip" style="
                        visibility: hidden;
                        background-color: #333;
                        color: #fff;
                        text-align: center;
                        border-radius: 5px;
                        padding: 6px;
                        position: absolute;
                        z-index: 1;
                        top: 50%;
                        right: 125%;
                        transform: translateY(-50%);
                        opacity: 0;
                        transition: opacity 0.3s;
                        white-space: nowrap;
                        font-size: 12px;
                        min-width: 180px;
                    ">
                        <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${profName}</div>

                        <div><strong>Difficulty:</strong> ${profRating.avgDifficulty ?? "N/A"}</div>
                        <div><strong>Ratings:</strong> ${profRating.numRatings ?? "N/A"}</div>
                        <div><strong>Would Take Again:</strong> ${Math.round(profRating.wouldTakeAgainPercent) ?? "N/A"}%</div>
                        <div style="font-size: 10px; text-align: center; margin-top: 5px;">
                            <a href="https://www.ratemyprofessors.com/professor/${profRating.legacyId}" target="_blank" style="color: #1a0dab;">
                                View on RateMyProfessors
                            </a>
                        </div>
                        <div style="
                            position: absolute;
                            top: 50%;
                            right: -5px;
                            margin-top: -5px;
                            width: 0;
                            height: 0;
                            border-top: 5px solid transparent;
                            border-bottom: 5px solid transparent;
                            border-left: 5px solid #333;
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
                }, 400); // small delay to avoid flicker
            };
        
            tooltip.addEventListener("mouseenter", showTooltip);
            tooltip.addEventListener("mouseleave", hideTooltip);
            // tooltipText.addEventListener("mouseenter", showTooltip);
            // tooltipText.addEventListener("mouseleave", hideTooltip);
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
