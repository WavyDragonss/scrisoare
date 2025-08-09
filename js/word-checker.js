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
  "O facem mereu împreună și doar împreună...incepe cu C",
  "Când spun ceva funny, începe cu B și se termină în h",
  "O facem împreună uneori începe cu G",
  "No hint!!!",
  "TE..."
];

// FINAL LETTERS for completion
const finalLetters = ['I', 'U', 'B', 'I', 'R', 'E'];

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
  let allCompleted = true;

  rows.forEach((row, rowIndex) => {
    // Skip if row is already completed (shrunk)
    if (row.dataset.completed === "true") return;

    const inputs = Array.from(row.querySelectorAll("input"));
    const correct = processedAnswers[rowIndex];

    let userWord = "";
    let rowCorrect = true;

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
        rowCorrect = false;
      } else {
        input.classList.remove("correct", "incorrect");
        rowCorrect = false;
      }
    });

    // If this whole row is correct and not yet completed: shrink it!
    if (rowCorrect && userWord.length === correct.length) {
      row.innerHTML = "";
      row.dataset.completed = "true";

      // Centered box for final letter
      for (let i = 0; i < 2; i++) {
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        row.appendChild(spacer);
      }

      const input = document.createElement("input");
      input.value = finalLetters[rowIndex];
      input.readOnly = true;
      input.classList.add("correct");
      input.style.boxShadow = "0 2px 16px #d4006f11";
      row.appendChild(input);

      for (let i = 0; i < 2; i++) {
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        row.appendChild(spacer);
      }

      // Fade in effect
      row.style.opacity = 0;
      setTimeout(() => { row.style.transition = "opacity 0.5s"; row.style.opacity = 1; }, 20);
    } else {
      allCompleted = false;
    }
  });

  // After all 6 rows are shrunk, show Continue button
  if (allCompleted && !document.getElementById("continue-btn")) {
    const btn = document.createElement("button");
    btn.id = "continue-btn";
    btn.textContent = "Continuă";
    btn.onclick = () => window.location.href = "surpriza.html";

    grid.appendChild(btn);

    // Scroll into view on mobile
    setTimeout(() => {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.style.opacity = 0;
      btn.style.transition = "opacity 0.5s";
      setTimeout(() => btn.style.opacity = 1, 20);
    }, 120);
  }
}

// Autofocus on page load (mobile fix)
window.onload = () => {
  const first = document.querySelector(".grid-row input");
  if (first) first.focus();
};

function checkAnswers() {
  const rows = Array.from(document.querySelectorAll(".grid-row"));
  let allCompleted = true;

  rows.forEach((row, rowIndex) => {
    // Skip if row is already completed (shrunk)
    if (row.dataset.completed === "true") return;

    const inputs = Array.from(row.querySelectorAll("input"));
    const correct = processedAnswers[rowIndex];

    let userWord = "";
    let rowCorrect = true;

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
        rowCorrect = false;
      } else {
        input.classList.remove("correct", "incorrect");
        rowCorrect = false;
      }
    });

    // If this whole row is correct and not yet completed: shrink it!
    if (rowCorrect && userWord.length === correct.length) {
      row.innerHTML = "";
      row.dataset.completed = "true";

      // Centered box for final letter
      for (let i = 0; i < 2; i++) {
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        row.appendChild(spacer);
      }

      const input = document.createElement("input");
      input.value = finalLetters[rowIndex];
      input.readOnly = true;
      input.classList.add("correct");
      input.style.boxShadow = "0 2px 16px #d4006f11";
      row.appendChild(input);

      for (let i = 0; i < 2; i++) {
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        row.appendChild(spacer);
      }

      // Fade in effect
      row.style.opacity = 0;
      setTimeout(() => { row.style.transition = "opacity 0.5s"; row.style.opacity = 1; }, 20);
    } else {
      allCompleted = false;
    }
  });

  // After all 6 rows are shrunk, show Continue button and redirect after 5s
  if (allCompleted && !document.getElementById("continue-btn")) {
    // Optional info message
    const msg = document.createElement("div");
    msg.id = "auto-redirect-msg";
    msg.textContent = "FELICITARII AAHHH IN 5 SECUNDE VEI TRECE LA URMATORUL PAS!!!";
    msg.style.margin = "20px auto 0 auto";
    msg.style.fontSize = "1.06rem";
    msg.style.color = "#d4006f";
    msg.style.fontWeight = "600";
    msg.style.maxWidth = "400px";
    msg.style.textAlign = "center";
    grid.appendChild(msg);

    const btn = document.createElement("button");
    btn.id = "continue-btn";
    btn.textContent = "Continuă";
    btn.addEventListener("click", () => {
      window.location.href = "surpriza.html";
    });
    grid.appendChild(btn);

    // Scroll into view on mobile
    setTimeout(() => {
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.style.opacity = 0;
      btn.style.transition = "opacity 0.5s";
      setTimeout(() => btn.style.opacity = 1, 20);
    }, 120);

    // Auto-redirect after 5 seconds
    setTimeout(() => {
      window.location.href = "memory.html";
    }, 5000);
  }
}

// Autofocus on page load (mobile fix)
window.onload = () => {
  const first = document.querySelector(".grid-row input");
  if (first) first.focus();
};