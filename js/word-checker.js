// QUESTIONS AND ANSWERS — do not change order!
const questions = [
  { q: "1. Animalul meu preferat?", a: "Pisica" },
  { q: "2. Activitatea mea preferata?", a: "Cuddling" },
  { q: "3. How do you call me?", a: "Bitch" },
  { q: "4. My relaxation activity?", a: "Gaming" },
  { q: "5. Culoarea mea preferata?", a: "Royal Red" },
  { q: "6. I❤️U.", a: "Iubesc" }
];

// Preprocess answers: keep only letters uppercased, remove spaces
const processedAnswers = questions.map(obj =>
  obj.a.toUpperCase().replace(/[^A-Z]/g, '')
);

const grid = document.getElementById("word-grid");
const questionDiv = document.getElementById("questions");

// Render questions and grid
questions.forEach((item, rowIndex) => {
  // Add question text
  const qEl = document.createElement("p");
  qEl.textContent = item.q;
  questionDiv.appendChild(qEl);

  // Create row for answer
  const word = processedAnswers[rowIndex];
  const row = document.createElement("div");
  row.classList.add("grid-row");

  for (let i = 0; i < word.length; i++) {
    const input = document.createElement("input");
    input.maxLength = 1;
    input.autocomplete = "off";
    input.inputMode = "text";
    input.dataset.row = rowIndex;
    input.dataset.col = i;
    if (rowIndex === 0 && i === 0) input.autofocus = true;
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown);
    row.appendChild(input);
  }
  grid.appendChild(row);
});

// Input focus and navigation
function handleInput(e) {
  const input = e.target;
  let value = input.value.toUpperCase().replace(/[^A-Z]/, "");
  input.value = value;

  // Auto move to next if typed, or back if deleted
  if (value) {
    const next = input.nextElementSibling;
    if (next) next.focus();
  }
  checkAnswers();
}

function handleKeyDown(e) {
  const input = e.target;
  if (e.key === "Backspace" && !input.value) {
    const prev = input.previousElementSibling;
    if (prev) prev.focus();
  }
}

// Main validation and win logic
function checkAnswers() {
  const rows = Array.from(document.querySelectorAll(".grid-row"));
  let middleWord = "";

  rows.forEach((row, rowIndex) => {
    const inputs = Array.from(row.querySelectorAll("input"));
    const correct = processedAnswers[rowIndex];
    let userWord = "";

    inputs.forEach((input, i) => {
      const val = input.value.toUpperCase();
      userWord += val;
      // Coloring
      if (val === correct[i]) {
        input.classList.add("correct");
        input.classList.remove("incorrect");
      } else if (val.length > 0) {
        input.classList.remove("correct");
        input.classList.add("incorrect");
      } else {
        input.classList.remove("correct", "incorrect");
      }
    });

    // Collect the MIDDLE column letter for this row if exists
    const midIdx = Math.floor(correct.length / 2);
    middleWord += inputs[midIdx] ? (inputs[midIdx].value.toUpperCase() || " ") : " ";
  });

  // Check if all answers correct
  const allCorrect = rows.every((row, idx) => {
    const inputs = Array.from(row.querySelectorAll("input"));
    const correct = processedAnswers[idx];
    return inputs.map(i => i.value.toUpperCase()).join('') === correct;
  });

  // Must match "IUBIRE" in the middle column
  if (allCorrect && middleWord.replace(/\s/g,'') === "IUBIRE") {
    setTimeout(() => {
      window.location.href = "surpriza.html";
    }, 700);
  }
}

// Autofocus on page load (mobile fix)
window.onload = () => {
  const first = document.querySelector(".grid-row input");
  if (first) first.focus();
};