import { getProfessorRating } from "./utils";

const professorCells = document.querySelectorAll('td[width="9%"]:last-child');
// const names = Array.from(professorCells).map(cell => cell.textContent?.trim());
// const filteredNames = names.filter((name) : name is string => name !== undefined);
const filteredNames = Array.from(professorCells).flatMap(cell => cell.textContent?.trim() ?? []);

//do a for each loop and get names from that, then call the get rating
professorCells.forEach(async prof => {
    const profName = prof.textContent?.trim();
    if (!profName || profName === "Instructor") {
        return
    }
    console.log(profName)

    const originalContent = prof.innerHTML;

    const profRating = await getProfessorRating(profName)
    if (profRating) {
        console.log(`Rating for ${profName}: ${profRating.avgRating}`);

        // Determine color based on rating value
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
            <span style="
                display: inline-block;
                background-color: ${ratingColor};
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                font-size: 11px;
                font-weight: bold;
            ">
                ${profRating.avgRating}
            </span>
        `;

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
