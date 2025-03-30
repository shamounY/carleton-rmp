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

    const profRating = await getProfessorRating(profName)
    if (profRating) {
        console.log(`Rating for ${profName}: ${profRating.avgDifficulty}`);
    }
    else {
        console.log(`Sorry no rating for ${profName}`)
    }

})
