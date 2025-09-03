let started = false;
let continueReady = false;
let messageIndex = 0;
let messages = [];
let autoAdvanceTimer = null;

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
function fadeOutElem(elem, extraClass = null, after = 320) {
  elem.classList.add('fading');
  setTimeout(() => hideElem(elem, extraClass), after);
}

// Initial state: "Tap to start"
message.textContent = 'Tap to start';
showElem(message);
// Hide image initially
hideElem(turnImage);

// Splash phase 1: Tap to start
function onFirstTap() {
  if (started) return;
  started = true;
  hideElem(message);
  // Wait 1s
  setTimeout(() => {
    // Show rotation instruction
    showElem(message, 'Întoarce telefonul');
    showElem(turnImage);
    // Keep for 2s
    setTimeout(() => {
      fadeOutElem(turnImage);
      showElem(message, 'Apasă pentru a continua', 'pulse');
      continueReady = true;
    }, 2000);
  }, 1000);
}

// Splash phase 2: Tap to continue
function onContinueTap() {
  if (!continueReady) return;
  continueReady = false;
  hideElem(message, 'pulse');
  // Start Romanian message sequence
  startMessageSequence();
}

// Phase 3: Romanian Message Sequence
function startMessageSequence() {
  // Fetch messages from misc/text.txt
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

function showMessage(idx) {
  hideElem(turnImage);
  message.textContent = messages[idx];
  showElem(message);
  message.classList.remove('pulse');
  // Set up auto-advance after 3s
  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => {
    advanceMessage(1);
  }, 3000);
}

function advanceMessage(dir) {
  clearTimeout(autoAdvanceTimer);
  let nextIdx = messageIndex + dir;
  if (nextIdx < 0) nextIdx = 0;
  if (nextIdx >= messages.length) nextIdx = messages.length - 1;
  if (nextIdx !== messageIndex) {
    messageIndex = nextIdx;
    showMessage(messageIndex);
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

// Event listeners
window.addEventListener('pointerdown', function(evt) {
  if (!started) {
    onFirstTap();
  } else if (continueReady) {
    onContinueTap();
  } else if (messages.length > 0) {
    onMessageTap(evt);
  }
});
window.addEventListener('touchstart', function(evt) {
  if (!started) {
    onFirstTap();
  } else if (continueReady) {
    onContinueTap();
  } else if (messages.length > 0) {
    onMessageTap(evt);
  }
});
window.addEventListener('click', function(evt) {
  if (!started) {
    onFirstTap();
  } else if (continueReady) {
    onContinueTap();
  } else if (messages.length > 0) {
    onMessageTap(evt);
  }
});

// Prevent scroll during splash
document.body.style.overflow = 'hidden';