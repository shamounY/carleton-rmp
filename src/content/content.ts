import { getProfessorRating, createProfessorRatingHTML } from "./utils";

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
        prof.innerHTML = `
            ${originalContent}
            <br/>
            <span style="
                background-color: #e0e0e0;
                color: #666;
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
            ">N/A</span>
        `;
    }
})