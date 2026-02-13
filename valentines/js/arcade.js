const STORE = "kawaii_valentine_ext_v1";
const CODES = ["CUPID", "PINKBOW", "LOVELETTER", "SWEETHEART", "MOONMILK", "FOREVER"];
const PASSWORDS = { 1: "BOWTIME", 2: "PINKKEY", 3: "SWEETLOCK" };
const EVENTS = ["checkpoint_reached", "skip_used", "code_ok", "code_fail", "quiz_complete", "game_complete"];

const I18N = {
  en: {
    main_title: "Be my Valentine?",
    main_sub: "90-question exam then 3 mini-games.",
    start: "Start",
    results_title: "Quiz Complete",
    credits_title: "Thanks",
    credits_body: "Original kawaii-style assets only, no copyrighted character art.",
    lock_help: "Enter password to continue."
  },
  ro: {
    main_title: "Vrei sa fii Valentine-ul meu?",
    main_sub: "Examen cu 90 de intrebari apoi 3 mini-jocuri.",
    start: "Start",
    results_title: "Quiz terminat",
    credits_title: "Multumesc",
    credits_body: "Doar elemente kawaii originale, fara arta protejata.",
    lock_help: "Introdu parola pentru a continua."
  }
};

const app = document.getElementById("app");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = loadState();
let questions = [];
let answered = false;
let timerOn = false;
let timerVal = 0;
let timerInt = null;
let hintUsed = false;

boot();
window.addEventListener("keydown", onKey);

function defaults() {
  return {
    stage: "main",
    locale: "ro",
    motion: !reduceMotion,
    lv: {
      q: 0,
      s: 0,
      st: 0,
      codes: [],
      unlocks: { quiz: false, g1: false, g2: false, g3: false },
      stats: { right: 0, wrong: 0 }
    },
    game: { id: 0, done: false, timer: 0, data: {} }
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE) || "null");
    if (!parsed) return defaults();
    return {
      ...defaults(),
      ...parsed,
      lv: { ...defaults().lv, ...parsed.lv, unlocks: { ...defaults().lv.unlocks, ...(parsed.lv?.unlocks || {}) }, stats: { ...defaults().lv.stats, ...(parsed.lv?.stats || {}) } }
    };
  } catch {
    return defaults();
  }
}

function saveState() {
  localStorage.setItem(STORE, JSON.stringify(state));
  sessionStorage.setItem("lv.q", String(state.lv.q));
  sessionStorage.setItem("lv.s", String(state.lv.s));
  sessionStorage.setItem("lv.st", String(state.lv.st));
  sessionStorage.setItem("lv.codes", JSON.stringify(state.lv.codes));
  sessionStorage.setItem("lv.unlocks", JSON.stringify(state.lv.unlocks));
}

function ev(name, payload = {}) {
  if (!EVENTS.includes(name)) return;
  const key = "kawaii_events";
  let rows = [];
  try {
    rows = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push({ name, ts: Date.now(), ...payload });
  localStorage.setItem(key, JSON.stringify(rows.slice(-800)));
}

function t(key) {
  return I18N[state.locale][key] || key;
}

function applyI18n() {
  app.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function tpl(id) {
  const node = document.getElementById(id);
  app.innerHTML = "";
  app.appendChild(node.content.cloneNode(true));
  applyI18n();
}

async function boot() {
  questions = await loadQuestions();
  renderByStage();
}

function renderByStage() {
  clearTimer();
  if (state.stage === "main") return renderMain();
  if (state.stage === "quiz") return renderQuiz();
  if (state.stage === "checkpoint") return renderCheckpoint();
  if (state.stage === "results") return renderResults();
  if (state.stage === "lock") return renderLock();
  if (state.stage === "game") return renderGame();
  if (state.stage === "credits") return renderCredits();
  state.stage = "main";
  renderMain();
}

function renderMain() {
  tpl("screen-main");
  const resumeLine = document.getElementById("resumeLine");
  resumeLine.textContent = state.lv.q > 0 && state.lv.q < 90 ? `Resume available at Q${state.lv.q + 1}.` : "Fresh start ready.";

  document.getElementById("startBtn").addEventListener("click", () => {
    state.stage = "quiz";
    saveState();
    renderByStage();
  });

  document.getElementById("langBtn").addEventListener("click", () => {
    state.locale = state.locale === "ro" ? "en" : "ro";
    saveState();
    renderByStage();
  });

  document.getElementById("motionBtn").addEventListener("click", () => {
    state.motion = !state.motion;
    saveState();
    renderByStage();
  });
}

function renderQuiz() {
  tpl("screen-quiz");
  answered = false;
  hintUsed = false;

  const q = questions[state.lv.q];
  if (!q) {
    state.lv.unlocks.quiz = true;
    ev("quiz_complete", { score: state.lv.s, right: state.lv.stats.right, wrong: state.lv.stats.wrong });
    state.stage = "results";
    saveState();
    return renderByStage();
  }

  document.getElementById("qProgress").textContent = `Q ${state.lv.q + 1}/90 • Score ${state.lv.s} • Streak ${state.lv.st}`;
  document.getElementById("qPrompt").textContent = q.prompt;

  const wrap = document.getElementById("qChoices");
  q.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice";
    b.setAttribute("aria-label", `Choice ${i + 1}`);
    b.textContent = `${String.fromCharCode(65 + i)}. ${c}`;
    b.addEventListener("click", () => answerQuestion(i));
    wrap.appendChild(b);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    state.lv.q += 1;
    saveState();

    if (state.lv.q > 0 && state.lv.q % 15 === 0) {
      state.stage = "checkpoint";
      ev("checkpoint_reached", { q: state.lv.q, code: CODES[state.lv.q / 15 - 1] });
      saveState();
    }

    renderByStage();
  });

  document.getElementById("hintBtn").addEventListener("click", useHint);

  document.getElementById("timerBtn").addEventListener("click", () => {
    timerOn = !timerOn;
    renderQuiz();
  });

  document.getElementById("skipBtn").addEventListener("click", () => toggleSkip(true));

  document.getElementById("skipApplyBtn").addEventListener("click", applySkip);
  document.getElementById("skipCloseBtn").addEventListener("click", () => toggleSkip(false));

  document.addEventListener("keydown", escCloseSkip, { once: true });

  if (timerOn) {
    startTimer(25);
  } else {
    document.getElementById("timerLine").textContent = "Timer off (Assist mode).";
    document.getElementById("timerBtn").textContent = "Timer: Off";
  }
}

function escCloseSkip(e) {
  if (e.key === "Escape") toggleSkip(false);
}

function toggleSkip(show) {
  const panel = document.getElementById("skipPanel");
  if (!panel) return;
  panel.classList.toggle("hidden", !show);
}

function applySkip() {
  const code = (document.getElementById("skipCodeInput").value || "").trim().toUpperCase();
  const target = document.getElementById("skipTarget").value;
  const msg = document.getElementById("skipMsg");
  const panel = document.getElementById("skipPanel");

  const valid = state.lv.codes.includes(code);
  ev("skip_used", { code, target, valid });

  if (!valid) {
    msg.className = "feedback bad";
    msg.textContent = "Invalid code.";
    panel.classList.remove("shake");
    void panel.offsetWidth;
    panel.classList.add("shake");
    ev("code_fail", { context: "skip", code });
    return;
  }

  msg.className = "feedback good";
  msg.textContent = "Code accepted.";
  ev("code_ok", { context: "skip", code, target });

  if (target === "resume") {
    toggleSkip(false);
    return;
  }

  if (target === "nextCP") {
    state.lv.q = Math.min(89, Math.ceil((state.lv.q + 1) / 15) * 15);
    saveState();
    renderByStage();
    return;
  }

  state.lv.unlocks.quiz = true;
  state.stage = "results";
  saveState();
  renderByStage();
}

function answerQuestion(index) {
  if (answered) return;
  answered = true;
  clearTimer();

  const q = questions[state.lv.q];
  const feedback = document.getElementById("qFeedback");
  const choices = Array.from(document.querySelectorAll(".choice"));

  choices.forEach((c, i) => {
    c.disabled = true;
    if (i === q.answer) c.classList.add("good");
  });

  if (index === q.answer) {
    state.lv.s += 100;
    state.lv.st += 1;
    state.lv.s += 10 * Math.max(0, state.lv.st - 1);
    state.lv.stats.right += 1;
    feedback.className = "feedback good";
    feedback.textContent = `✅ ${q.explanation}`;
  } else {
    state.lv.s -= 25;
    state.lv.st = 0;
    state.lv.stats.wrong += 1;
    if (index >= 0 && choices[index]) {
      choices[index].classList.add("bad");
    }
    feedback.className = "feedback bad";
    feedback.textContent = `❌ ${q.explanation}`;
  }

  document.getElementById("nextBtn").disabled = false;
  saveState();
}

function useHint() {
  if (answered || hintUsed) return;
  hintUsed = true;
  const feedback = document.getElementById("qFeedback");
  const choices = Array.from(document.querySelectorAll(".choice"));
  const q = questions[state.lv.q];

  if (Math.random() > 0.5) {
    state.lv.s -= 30;
    const wrong = choices.find((_, i) => i !== q.answer && !choices[i].disabled);
    if (wrong) wrong.disabled = true;
    feedback.className = "feedback bad";
    feedback.textContent = "Hint used: one wrong option removed (-30).";
  } else {
    state.lv.st = 0;
    feedback.className = "feedback bad";
    feedback.textContent = "Hint used: nudge applied (streak reset).";
  }

  saveState();
}

function renderCheckpoint() {
  tpl("screen-checkpoint");
  const idx = Math.floor(state.lv.q / 15) - 1;
  const code = CODES[idx] || CODES[CODES.length - 1];

  if (!state.lv.codes.includes(code)) state.lv.codes.push(code);
  saveState();

  document.getElementById("cpTitle").textContent = `Checkpoint ${state.lv.q}/90`;
  document.getElementById("cpCode").textContent = code;

  document.getElementById("copyCodeBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      document.getElementById("cpMsg").textContent = "Code copied.";
    } catch {
      document.getElementById("cpMsg").textContent = "Copy blocked. Select manually.";
    }
  });

  document.getElementById("cpNextBtn").addEventListener("click", () => {
    if (state.lv.q >= 90) {
      state.lv.unlocks.quiz = true;
      state.stage = "results";
    } else {
      state.stage = "quiz";
    }
    saveState();
    renderByStage();
  });
}

function renderResults() {
  tpl("screen-results");
  document.getElementById("resultsLine").textContent = `Score: ${state.lv.s} | Right: ${state.lv.stats.right} | Wrong: ${state.lv.stats.wrong}`;

  document.getElementById("toLock1Btn").addEventListener("click", () => {
    state.game.id = 1;
    state.stage = "lock";
    saveState();
    renderByStage();
  });

  document.getElementById("resetQuizBtn").addEventListener("click", () => {
    state.lv.q = 0;
    state.lv.s = 0;
    state.lv.st = 0;
    state.lv.codes = [];
    state.lv.stats = { right: 0, wrong: 0 };
    state.lv.unlocks.quiz = false;
    state.stage = "quiz";
    saveState();
    renderByStage();
  });
}

function renderLock() {
  tpl("screen-lock");
  const id = state.game.id;
  const card = document.getElementById("lockCard");
  document.getElementById("lockTitle").textContent = `Game ${id} Lock`;

  document.getElementById("lockForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = (document.getElementById("lockInput").value || "").trim().toUpperCase();
    const ok = value === PASSWORDS[id];

    if (!ok) {
      document.getElementById("lockMsg").className = "feedback bad";
      document.getElementById("lockMsg").textContent = "Wrong password.";
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      ev("code_fail", { context: "lock", game: id });
      return;
    }

    ev("code_ok", { context: "lock", game: id });
    document.getElementById("lockMsg").className = "feedback good";
    document.getElementById("lockMsg").textContent = "Unlocked.";
    state.stage = "game";
    state.game.done = false;
    state.game.timer = 0;
    state.game.data = {};
    saveState();
    renderByStage();
  });
}

function renderGame() {
  tpl("screen-game");
  const id = state.game.id;
  document.getElementById("gameTag").textContent = `GAME ${id}`;
  document.getElementById("gameTitle").textContent = id === 1 ? "HeartCatch" : id === 2 ? "LoveMaze" : "MemoryKiss";

  if (id === 1) initHeartCatch();
  if (id === 2) initLoveMaze();
  if (id === 3) initMemoryKiss();

  document.getElementById("gameExitBtn").addEventListener("click", () => {
    state.stage = "results";
    saveState();
    renderByStage();
  });
}

function initHeartCatch() {
  const area = document.getElementById("gameArea");
  const action = document.getElementById("gameActionBtn");
  const meta = document.getElementById("gameMeta");
  const msg = document.getElementById("gameMsg");
  let left = 60;
  let hits = 0;

  area.innerHTML = `<div class="hearts" id="hearts"></div>`;
  const heartsWrap = document.getElementById("hearts");

  function spawnHearts() {
    heartsWrap.innerHTML = "";
    for (let i = 0; i < 8; i += 1) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "heart";
      b.textContent = Math.random() > 0.45 ? "❤" : "🎀";
      b.addEventListener("click", () => {
        if (b.textContent === "❤") {
          hits += 1;
          b.disabled = true;
          meta.textContent = `Time ${left}s | Hearts ${hits}`;
        }
      });
      heartsWrap.appendChild(b);
    }
  }

  function done() {
    clearTimer();
    const pass = hits >= 14;
    if (pass) {
      msg.className = "feedback good";
      msg.textContent = `Game complete: ${hits} hearts.`;
      onGameComplete(1);
    } else {
      msg.className = "feedback bad";
      msg.textContent = `Need at least 14 hearts. You got ${hits}. Retry.`;
    }
    action.textContent = "Retry";
  }

  action.addEventListener("click", () => {
    clearTimer();
    left = 60;
    hits = 0;
    msg.textContent = "";
    spawnHearts();
    meta.textContent = `Time ${left}s | Hearts ${hits}`;
    action.textContent = "Running...";

    timerInt = setInterval(() => {
      left -= 1;
      spawnHearts();
      meta.textContent = `Time ${left}s | Hearts ${hits}`;
      if (left <= 0) done();
    }, 1000);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      const h = Array.from(heartsWrap.querySelectorAll(".heart")).find((x) => !x.disabled && x.textContent === "❤");
      if (h) h.click();
    }
  });
}

function initLoveMaze() {
  const area = document.getElementById("gameArea");
  const action = document.getElementById("gameActionBtn");
  const meta = document.getElementById("gameMeta");
  const msg = document.getElementById("gameMsg");

  let left = 90;
  let p = { x: 0, y: 0 };
  const gift = { x: 6, y: 6 };

  area.innerHTML = `<div class="maze" id="maze"></div>`;
  const maze = document.getElementById("maze");

  function draw() {
    maze.innerHTML = "";
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (p.x === x && p.y === y) cell.textContent = "🐾";
        else if (gift.x === x && gift.y === y) cell.textContent = "🎁";
        maze.appendChild(cell);
      }
    }
    meta.textContent = `Time ${left}s | Pos ${p.x + 1},${p.y + 1}`;
  }

  function move(dx, dy) {
    p.x = Math.max(0, Math.min(6, p.x + dx));
    p.y = Math.max(0, Math.min(6, p.y + dy));
    draw();

    if (p.x === gift.x && p.y === gift.y) {
      clearTimer();
      msg.className = "feedback good";
      msg.textContent = "Gift reached.";
      onGameComplete(2);
      action.textContent = "Replay";
    }
  }

  action.addEventListener("click", () => {
    clearTimer();
    left = 90;
    p = { x: 0, y: 0 };
    msg.textContent = "";
    draw();

    timerInt = setInterval(() => {
      left -= 1;
      meta.textContent = `Time ${left}s | Pos ${p.x + 1},${p.y + 1}`;
      if (left <= 0) {
        clearTimer();
        msg.className = "feedback bad";
        msg.textContent = "Time up. Retry.";
      }
    }, 1000);
  });

  document.addEventListener("keydown", (e) => {
    if (!app.querySelector(".game")) return;
    const k = e.key.toLowerCase();
    if (k === "arrowup" || k === "w") move(0, -1);
    if (k === "arrowdown" || k === "s") move(0, 1);
    if (k === "arrowleft" || k === "a") move(-1, 0);
    if (k === "arrowright" || k === "d") move(1, 0);
  });
}

function initMemoryKiss() {
  const area = document.getElementById("gameArea");
  const action = document.getElementById("gameActionBtn");
  const meta = document.getElementById("gameMeta");
  const msg = document.getElementById("gameMsg");
  let round = 1;
  let open = [];
  let matched = 0;

  function buildRound() {
    const pairs = 2 + round;
    const symbols = ["💌", "🎀", "⭐", "❤", "🌙"]; 
    const list = [];
    for (let i = 0; i < pairs; i += 1) {
      list.push(symbols[i], symbols[i]);
    }
    const deck = shuffle(list);

    area.innerHTML = `<div class="mem-grid" id="memGrid"></div>`;
    const grid = document.getElementById("memGrid");
    open = [];
    matched = 0;

    deck.forEach((sym) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "memory";
      b.textContent = "?";
      b.dataset.sym = sym;
      b.addEventListener("click", () => {
        if (b.disabled || open.length === 2 || b.classList.contains("flip")) return;
        b.classList.add("flip");
        b.textContent = sym;
        open.push(b);

        if (open.length === 2) {
          const [a, c] = open;
          if (a.dataset.sym === c.dataset.sym) {
            a.disabled = true;
            c.disabled = true;
            matched += 1;
            open = [];
            if (matched === pairs) {
              round += 1;
              if (round > 3) {
                msg.className = "feedback good";
                msg.textContent = "All 3 rounds complete.";
                onGameComplete(3);
                action.textContent = "Replay";
              } else {
                meta.textContent = `Round ${round}/3`;
                buildRound();
              }
            }
          } else {
            setTimeout(() => {
              a.classList.remove("flip");
              c.classList.remove("flip");
              a.textContent = "?";
              c.textContent = "?";
              open = [];
            }, state.motion ? 380 : 0);
          }
        }
      });
      grid.appendChild(b);
    });

    meta.textContent = `Round ${round}/3`;
  }

  action.addEventListener("click", () => {
    round = 1;
    msg.textContent = "";
    buildRound();
  });
}

function onGameComplete(id) {
  ev("game_complete", { id });
  if (id === 1) {
    state.lv.unlocks.g1 = true;
    state.game.id = 2;
    state.stage = "lock";
  } else if (id === 2) {
    state.lv.unlocks.g2 = true;
    state.game.id = 3;
    state.stage = "lock";
  } else {
    state.lv.unlocks.g3 = true;
    state.stage = "credits";
  }
  saveState();
  renderByStage();
}

function renderCredits() {
  tpl("screen-credits");
  document.getElementById("backMainBtn").addEventListener("click", () => {
    state.stage = "main";
    saveState();
    renderByStage();
  });
}

function onKey(e) {
  if (state.stage === "quiz") {
    if (["1", "2", "3"].includes(e.key)) {
      answerQuestion(Number(e.key) - 1);
    }
    if (e.key === "Enter") {
      const b = document.getElementById("nextBtn");
      if (b && !b.disabled) b.click();
    }
    if (e.key === "Escape") toggleSkip(false);
  }
}

function startTimer(seconds) {
  clearTimer();
  timerVal = seconds;
  document.getElementById("timerBtn").textContent = "Timer: On";
  document.getElementById("timerLine").textContent = `Time left: ${timerVal}s`;

  timerInt = setInterval(() => {
    timerVal -= 1;
    const line = document.getElementById("timerLine");
    if (line) line.textContent = `Time left: ${timerVal}s`;
    if (timerVal <= 0) {
      clearTimer();
      if (!answered) {
        answerQuestion(-1);
      }
    }
  }, 1000);
}

function clearTimer() {
  if (timerInt) {
    clearInterval(timerInt);
    timerInt = null;
  }
}

async function loadQuestions() {
  try {
    const rsp = await fetch("/api/questions?set=loveExam");
    if (rsp.ok) {
      const data = await rsp.json();
      if (Array.isArray(data) && data.length >= 90) {
        return shuffle(data).slice(0, 90);
      }
    }
  } catch {
    // static fallback
  }
  return buildFallbackQuestions();
}

function buildFallbackQuestions() {
  const out = [];
  const themes = ["priority", "semaphores", "parking", "speed", "signals", "safety"];
  for (let i = 1; i <= 90; i += 1) {
    const correct = i % 3;
    const cpIdx = Math.floor((i - 1) / 15);
    out.push({
      id: i,
      prompt: `(${themes[i % themes.length]}) Q${i}: Choose the safest legal action in this driving scenario.`,
      choices: [
        "Act only after full check of signs and traffic.",
        "Rush first, then adapt.",
        "Ignore minor signs if road seems clear."
      ],
      answer: correct === 0 ? 0 : 0,
      explanation: "Defensive driving means full observation, legal priority, and controlled speed.",
      difficulty: i < 31 ? "easy" : i < 61 ? "medium" : "hard",
      checkpointCode: CODES[cpIdx]
    });
  }
  return shuffle(out);
}

function shuffle(arr) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

saveState();
