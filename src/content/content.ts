// More specific selector using the table structure


const professorCells = document.querySelectorAll('td[width="9%"]:last-child');
const names = Array.from(professorCells).map(cell => cell.textContent?.trim());
console.log(names)