let started = false;
let continueReady = false;
let messageIndex = 0;
let messages = [];
let autoAdvanceTimer = null;
let lastInputTime = 0; // For debounce

const splash = document.getElementById('splash');
const message = splash.querySelector('.message');
const turnImage = document.getElementById('turnImage');

// Helper functions
function showElem(elem, text = null, extraClass = null) {
  if (text !== null) elem.textContent = text;
  elem.classList.add('visible');
  if (extraClass) elem.classList.add(extraClass);
  elem.style.visibility = 'visible';
}
function hideElem(elem, extraClass = null) {
  elem.classList.remove('visible');
  if (extraClass) elem.classList.remove(extraClass);
  elem.style.visibility = 'hidden';
}
function fadeOutElem(elem, extraClass = null, after = 350) {
  elem.classList.add('fade-out');
  if (extraClass) elem.classList.add(extraClass);
  setTimeout(() => {
    elem.classList.remove('fade-out');
    if (extraClass) elem.classList.remove(extraClass);
    hideElem(elem);
  }, after);
}
function fadeInElem(elem, text = null, extraClass = null) {
  if (text !== null) elem.textContent = text;
  elem.style.visibility = 'visible';
  elem.classList.add('fade-in');
  if (extraClass) elem.classList.add(extraClass);
  setTimeout(() => {
    elem.classList.remove('fade-in');
    if (extraClass) elem.classList.remove(extraClass);
    elem.classList.add('visible');
  }, 350);
}

// Initial state: "Tap to start"
message.textContent = 'Apasă pentru a incepe';
showElem(message);
hideElem(turnImage);

// Splash phase 1: Tap to start
function onFirstTap() {
  hideElem(message);
  started = true;
  setTimeout(() => {
    showElem(message, 'Întoarce telefonul');
    showElem(turnImage);
    setTimeout(() => {
      turnImage.classList.add('fading');
      setTimeout(() => hideElem(turnImage, 'fading'), 320);
      showElem(message, 'Apasă pentru a continua', 'pulse');
      continueReady = true;
    }, 5000);
  }, 1000);
}

// Splash phase 2: Tap to continue
function onContinueTap() {
  hideElem(message, 'pulse');
  continueReady = false;
  startMessageSequence();
}

// Fetch messages from text.txt (Romanian)
function startMessageSequence() {
  fetch('misc/text.txt')
    .then(resp => resp.ok ? resp.text() : '')
    .then(text => {
      messages = text.split('\n').map(line => line.trim()).filter(Boolean);
      if (messages.length === 0) {
        messages = ['(No messages found in misc/text.txt)'];
      }
      messageIndex = 0;
      showMessage(messageIndex);
    });
}

async function loadCountdownTexts() {
  const res = await fetch("misc/text.txt");
  const lines = (await res.text()).split("\n").map(l => l.trim()).filter(Boolean);

  return {
    title: lines[0] || "Countdown",
    days: lines[1]?.split(",") || ["zile","zi"],
    hours: lines[2]?.split(",") || ["ore","oră"],
    mins: lines[3]?.split(",") || ["minute","minut"],
    secs: lines[4]?.split(",") || ["secunde","secundă"],
    done: lines[5] || "Gata!"
  };
}

function nextFeb13() {
  const now = new Date();
  const year = now.getFullYear();
  const feb13 = new Date(year, 1, 13, 0, 0, 0, 0);
  return now > feb13 ? new Date(year + 1, 1, 13, 0, 0, 0, 0) : feb13;
}

function pad2(n) { return n < 10 ? "0" + n : String(n); }

function startCountdown(texts) {
  const countdown = document.getElementById("countdown");
  countdown.classList.remove("hidden");

  document.querySelector(".cd-title").textContent = texts.title;

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const doneEl = document.getElementById("cd-done");

  function setLabel(id, value, labels) {
    const el = document.querySelector(`#${id}`).nextElementSibling;
    if (!el) return;
    el.textContent = (value === 1 ? labels[1] : labels[0]);
  }

  function tick() {
    const now = new Date();
    let diff = nextFeb13() - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      doneEl.textContent = texts.done;
      doneEl.classList.remove("hidden");
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= d * 86400000;
    const h = Math.floor(diff / (1000 * 60 * 60));
    diff -= h * 3600000;
    const m = Math.floor(diff / (1000 * 60));
    diff -= m * 60000;
    const s = Math.floor(diff / 1000);

    daysEl.textContent = pad2(d);
    hoursEl.textContent = pad2(h);
    minsEl.textContent = pad2(m);
    secsEl.textContent = pad2(s);

    setLabel("cd-days", d, texts.days);
    setLabel("cd-hours", h, texts.hours);
    setLabel("cd-mins", m, texts.mins);
    setLabel("cd-secs", s, texts.secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// After your “Tap to continue”:
loadCountdownTexts().then(startCountdown);


// Show message with animated transition, auto-advance every 4s
function showMessage(idx) {
  hideElem(turnImage);
  clearTimeout(autoAdvanceTimer);
  // Animate out old message if visible
  if (message.classList.contains('visible')) {
    fadeOutElem(message, 'slide-left');
    setTimeout(() => {
      fadeInElem(message, messages[idx], 'slide-left');
    }, 350);
  } else {
    fadeInElem(message, messages[idx], 'slide-left');
  }
  // Auto-advance after 4s
  if (idx < messages.length - 1) {
    autoAdvanceTimer = setTimeout(() => {
      messageIndex++;
      showMessage(messageIndex);
    }, 4000);
  }
}

// Debounced input handler
function handleInput(evt) {
  const now = Date.now();
  if (now - lastInputTime < 400) return;
  lastInputTime = now;

  if (!started) {
    onFirstTap();
  } else if (continueReady) {
    onContinueTap();
  }
}

// Only one event listener is needed!
window.addEventListener('pointerdown', handleInput);

// Prevent scroll during splash
document.body.style.overflow = 'hidden';