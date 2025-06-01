import { getProfessorRating, createProfessorRatingHTML, remmoveMiddleName } from "./utils";

const professorCells = document.querySelectorAll('td[width="9%"]:last-child');

// Loop through professors, get rating, and display
professorCells.forEach(async prof => {
    const profName = prof.textContent?.trim();
    if (!profName || profName === "Instructor") {
        return
    }
    
    const originalContent = prof.innerHTML;

    const profInfo = await getProfessorRating(profName);

    if (profInfo) {
        const newHTML = await createProfessorRatingHTML(profName, profInfo, originalContent);
        prof.innerHTML = newHTML;

        const tooltip = prof.querySelector(".tooltip-container");
        const tooltipText = prof.querySelector(".tooltip") as HTMLElement;

        if (tooltip && tooltipText) {
            let hideTimeout: ReturnType<typeof setTimeout>;
        
            const showTooltip = () => {
                clearTimeout(hideTimeout);
                
                // Calculate and set position
                const tooltipRect = tooltip.getBoundingClientRect();
                const tooltipTextRect = tooltipText.getBoundingClientRect();
                
                // Position to the left of the rating badge with some spacing
                const left = tooltipRect.left - tooltipTextRect.width - 10;
                const top = tooltipRect.top + (tooltipRect.height / 2) - (tooltipTextRect.height / 2);
                
                tooltipText.style.left = `${Math.max(10, left)}px`;
                tooltipText.style.top = `${top}px`;
                
                tooltipText.style.visibility = "visible";
                tooltipText.style.opacity = "1";
            };
        
            const hideTooltip = () => {
                hideTimeout = setTimeout(() => {
                    tooltipText.style.visibility = "hidden";
                    tooltipText.style.opacity = "0";
                }, 100);
            };
        
            tooltip.addEventListener("mouseenter", showTooltip);
            tooltip.addEventListener("mouseleave", hideTooltip);
        }        
    }

    else {
        prof.innerHTML = `
            ${originalContent}
            <br/>
            <span class="na">N/A</span>
        `;
    }
})
