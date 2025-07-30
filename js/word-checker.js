// QUESTIONS AND ANSWERS — do not change order!
const questions = [
  { q: "1. Animalul meu preferat?", a: "Pisica" },
  { q: "2. Activitatea mea preferata?", a: "Cuddling" },
  { q: "3. How do you call me?", a: "Bitch" },
  { q: "4. My relaxation activity?", a: "Gaming" },
  { q: "5. Culoarea mea preferata?", a: "Royal Red" },
  { q: "6. I❤️U.", a: "Iubesc" }
];

// HINTS ARRAY
const hints = [
  "Prietenul meu pufos!",
  "O facem mereu împreună și doar împreună",
  "Când spun ceva funny, începe cu B și se termină în h",
  "O facem împreună uneori începe cu G",
  "No hint!!!",
  "TE..."
];

// Preprocess answers: keep only letters uppercased, remove spaces
const processedAnswers = questions.map(obj =>
  obj.a.toUpperCase().replace(/[^A-Z]/g, '')
);

const grid = document.getElementById("word-grid");
const questionDiv = document.getElementById("questions");

// Render questions and grid
questions.forEach((item, rowIndex) => {
  // Create question container
  const container = document.createElement("div");
  container.classList.add("question-item");

  // Question text
  const qEl = document.createElement("p");
  qEl.textContent = item.q;

  // Hint button
  const hintBtn = document.createElement("button");
  hintBtn.textContent = "Hint";
  hintBtn.className = "hint-btn";
  hintBtn.addEventListener("click", () => {
    hintBtn.disabled = true;
    hintBtn.textContent = hints[rowIndex];
    hintBtn.classList.add("active");

    // Hide hint after 5 seconds
    setTimeout(() => {
      hintBtn.textContent = "Wait...";
      hintBtn.classList.remove("active");
    }, 5000);

    // Re-enable button after 10 more seconds (total 15)
    setTimeout(() => {
      hintBtn.textContent = "Hint";
      hintBtn.disabled = false;
    }, 15000);
  });

  container.appendChild(qEl);
  container.appendChild(hintBtn);
  questionDiv.appendChild(container);

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

  // Check if all inputs are green (correct) and middle column spells IUBIRE
  if (middleWord === "IUBIRE") {
    const allInputs = document.querySelectorAll("input");
    const allCorrect = Array.from(allInputs).every(inp => inp.classList.contains("correct"));

    if (allCorrect) {
      setTimeout(() => {
        transformToMiddleLetters();
      }, 800);
    }
  }
}

// Replace grid with IUBIRE in center column and add Proceed button
function transformToMiddleLetters() {
  const letters = ['I', 'U', 'B', 'I', 'R', 'E'];
  grid.innerHTML = ''; // clear grid

  letters.forEach(letter => {
    const row = document.createElement("div");
    row.classList.add("grid-row");
    row.style.marginBottom = "10px";
    // 5 columns: 2 spacers, 1 letter, 2 spacers for centering
    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement("div");
      spacer.style.flex = "1";
      row.appendChild(spacer);
    }

    const input = document.createElement("input");
    input.value = letter;
    input.readOnly = true;
    input.classList.add("correct");
    input.style.boxShadow = "0 2px 16px #d4006f11";
    row.appendChild(input);

    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement("div");
      spacer.style.flex = "1";
      row.appendChild(spacer);
    }

    grid.appendChild(row);
  });

  // Add Proceed button
  const proceedBtn = document.createElement("button");
  proceedBtn.textContent = "Proceed...";
  proceedBtn.className = "proceed-btn";
  proceedBtn.addEventListener("click", () => {
    window.location.href = "surpriza.html";
  });
  proceedBtn.style.margin = "32px auto 0 auto";
  proceedBtn.style.display = "block";
  grid.appendChild(proceedBtn);
}

// Autofocus on page load (mobile fix)
window.onload = () => {
  const first = document.querySelector(".grid-row input");
  if (first) first.focus();
};