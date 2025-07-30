const GRID_SIZE = 6;
const grid = document.getElementById("word-grid");

// Creează 6x6 inputuri
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
  const input = document.createElement("input");
  input.maxLength = 1;
  input.dataset.index = i;
  input.addEventListener("input", checkGrid);
  grid.appendChild(input);
}

// Verifică dacă pe linia de mijloc se află cuvântul "IUBIRE"
function checkGrid() {
  const inputs = grid.querySelectorAll("input");
  const middleRowStart = GRID_SIZE * Math.floor(GRID_SIZE / 2);
  const letters = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    const value = inputs[middleRowStart + i].value.toUpperCase();
    letters.push(value);
  }

  const word = letters.join('');
  if (word === "IUBIRE") {
    setTimeout(() => {
      window.location.href = "surpriza.html"; // Pagina ta specială
    }, 500);
  }
}
