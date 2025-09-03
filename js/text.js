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
message.textContent = 'Tap to start';
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
    }, 2000);
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
      showMessage(messageIndex, 'fade-in', null);
    });
}

// Show message with transition
function showMessage(idx, transition = 'fade-in', dir = null) {
  hideElem(turnImage);
  clearTimeout(autoAdvanceTimer);
  // Animate out old message if visible
  if (message.classList.contains('visible')) {
    let slideClass = dir === 'left' ? 'slide-left' : dir === 'right' ? 'slide-right' : '';
    fadeOutElem(message, slideClass);
    setTimeout(() => {
      fadeInElem(message, messages[idx], transition);
    }, 350);
  } else {
    fadeInElem(message, messages[idx], transition);
  }
  // Auto-advance after 3s
  autoAdvanceTimer = setTimeout(() => {
    advanceMessage(1);
  }, 3000);
}

// Advance/back with animated transition
function advanceMessage(dir) {
  clearTimeout(autoAdvanceTimer);
  let nextIdx = messageIndex + dir;
  if (nextIdx < 0) nextIdx = 0;
  if (nextIdx >= messages.length) nextIdx = messages.length - 1;
  if (nextIdx !== messageIndex) {
    let slideDir = dir === 1 ? 'left' : 'right';
    messageIndex = nextIdx;
    showMessage(messageIndex, 'fade-in', slideDir);
  }
}

// Touch/click handlers for advancing/back
function onMessageTap(evt) {
  // If message sequence not started, ignore
  if (messages.length === 0) return;
  // Get tap position: right side = advance, left side = back
  let x = 0;
  if (evt.touches && evt.touches.length) {
    x = evt.touches[0].clientX;
  } else {
    x = evt.clientX;
  }
  const screenW = window.innerWidth || document.documentElement.clientWidth;
  if (x > screenW * 0.5) {
    advanceMessage(1);
  } else {
    advanceMessage(-1);
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
  } else if (messages.length > 0) {
    onMessageTap(evt);
  }
}

// Only one event listener is needed!
window.addEventListener('pointerdown', handleInput);

// Prevent scroll during splash
document.body.style.overflow = 'hidden';