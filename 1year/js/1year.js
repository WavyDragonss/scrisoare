// -- ELEMENTS --
const giftBtn = document.querySelector('.gift-btn');
const emojiContainer = document.querySelector('.emoji-container');
const messageDiv = document.querySelector('.romantic-message');
const mainWrapper = document.querySelector('.main-wrapper');

// For message sequence overlay
let whiteTransitionScreen, messageSequenceScreen;

// -- CONFIG --
const burstEmojis = [ "💖", "❤️", "🥰", "🌸", "✨", "🫶", "😘", "💗", "💝" ];
const burstSparkles = [ "✨", "🩷", "🌸", "⭐️", "💫" ];
const MESSAGES = [
  "I can't believe it's already been a year.",
  "Every day with you feels new.",
  "You matter more to me than you'll ever know.",
  "I’d choose you again. Every single time.",
  "This is just the beginning. 💗"
];
const FIRST_EXPLODE_COUNT = 18;
const FIRST_SPARKLE_COUNT = 16;
const BURST_COUNT = 7;

// -- STATE --
let exploded = false;

// -- INTERACTION: EMOJI PARTICLE GENERATOR --
function createExplosionParticle(type = "emoji") {
  const isEmoji = type === "emoji";
  const set = isEmoji ? burstEmojis : burstSparkles;
  const el = document.createElement('span');
  el.className = isEmoji ? 'burst-emoji explode' : 'burst-sparkle explode';
  el.textContent = set[Math.floor(Math.random() * set.length)];

  // Random full-circle angle for explosion!
  const theta = Math.random() * 2 * Math.PI;
  const dist = (110 + Math.random() * 54); // px move outward
  const tx = Math.cos(theta) * dist;
  const ty = Math.sin(theta) * dist;
  const rot = -40 + Math.random() * 80;
  const scale = 1.18 + Math.random() * 0.62;
  el.style.setProperty('--tx', `${tx}px`);
  el.style.setProperty('--ty', `${ty}px`);
  el.style.setProperty('--rot', `${rot}deg`);
  el.style.setProperty('--scale', scale);

  // Random size for emojis, sparkles are smaller
  el.style.fontSize = (isEmoji ? (8 + Math.random()*3) : (3 + Math.random()*2)) + 'vw';

  emojiContainer.appendChild(el);

  // Clean up after animation completes
  el.addEventListener('animationend', () => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

function createSoftBurstParticle() {
  const el = document.createElement('span');
  el.className = 'burst-emoji burst';
  el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
  // Softer, mostly upward
  const xOff = (-65 + Math.random() * 130); // px left-right
  const yOff = -68 - Math.random() * 90;   // px upward
  const rot = -22 + Math.random() * 44;    // slight rotation
  const scale = 0.99 + Math.random() * 0.46;
  el.style.setProperty('--x', `${xOff}px`);
  el.style.setProperty('--y', `${yOff}px`);
  el.style.setProperty('--rot', `${rot}deg`);
  el.style.setProperty('--scale', scale);
  el.style.fontSize = (7 + Math.random()*2.6) + 'vw';

  emojiContainer.appendChild(el);
  el.addEventListener('animationend', () => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

// -- FIRST TAP: EXPLOSION + PAGE TRANSITION --
function handleGiftExplosion() {
  exploded = true;

  // 1. Play explosion "pop" on gift
  giftBtn.classList.add('explode');
  vibrate(26);

  // 2. Create emoji + sparkle burst, all directions
  for (let i = 0; i < FIRST_EXPLODE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("emoji"), Math.random()*100);

  for (let i = 0; i < FIRST_SPARKLE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("sparkle"), 25+Math.random()*110);

  // 3. After quick pop, fade gift out and bring in white screen
  setTimeout(() => {
    // Fade out the gift and stop animations
    giftBtn.classList.add('hide');

    // Create and fade in the white transition screen
    if (!whiteTransitionScreen) {
      whiteTransitionScreen = document.createElement('div');
      whiteTransitionScreen.className = 'white-transition';
      document.body.appendChild(whiteTransitionScreen);
      // Animate in
      setTimeout(()=>whiteTransitionScreen.classList.add('active'), 30);
    } else {
      whiteTransitionScreen.classList.add('active');
    }
    // Hide background
    mainWrapper.style.visibility = "hidden";

    // Proceed to message sequence after 1.1s on white
    setTimeout(startMessageSequence, 1100);
  }, 330);

  // Remove emoji animations after a second
  setTimeout(() => {
    emojiContainer.innerHTML = '';
  }, 900);
}

// -- SUBSEQUENT TAPS: SOFT BURST ONLY --
function softBurstFromGift() {
  for (let i = 0; i < BURST_COUNT; ++i)
    setTimeout(createSoftBurstParticle, Math.random() * 190);
  vibrate(10);
}

// -- TAP/VIBRATE SUPPORT --
function vibrate(ms) {
  if (navigator.vibrate) {
    navigator.vibrate(ms || 20);
  }
}

// -- SEQUENCED MESSAGE SCENE (AFTER WHITE FADE) --
function startMessageSequence() {
  // Remove/clean white and create overlay
  if (!messageSequenceScreen) {
    messageSequenceScreen = document.createElement('div');
    messageSequenceScreen.className = 'message-sequence';
    document.body.appendChild(messageSequenceScreen);
  } else {
    messageSequenceScreen.innerHTML = '';
  }
  // Lock scroll
  document.body.style.overflow = "hidden";
  // Scroll to top
  window.scrollTo(0,0);

  // Sequence each message with smooth appear/fade
  let idx = 0;
  function showNextMsg() {
    // Clean previous if any
    const prev = messageSequenceScreen.querySelector('.sequence-message.active');
    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('exit');
      setTimeout(()=>{ if(prev.parentNode) prev.parentNode.removeChild(prev); }, 700);
    }

    // Add new message
    const mDiv = document.createElement('div');
    mDiv.className = 'sequence-message';
    mDiv.textContent = MESSAGES[idx];

    messageSequenceScreen.appendChild(mDiv);
    // Animate in after a short tick
    setTimeout(()=>mDiv.classList.add('active'), 70);

    // Next step: another message, or finish with the last
    if (idx < MESSAGES.length - 1) {
      idx++;
      setTimeout(showNextMsg, 3200 + Math.random()*700); // 3–4s
    } else {
      // Final message: leave on screen, and pulse heart below
      setTimeout(() => pulseHeart(mDiv), 1000);
      // Optional: unlock scrolling after 2.5+ sec if you want
      setTimeout(() => { document.body.style.overflow='auto'; }, 2800);
    }
  }
  showNextMsg();
}

// Final animated pink heart under last message
// ...[your previous code above remains unchanged]...

// -- FINAL: Add animated heart under last message --
function pulseHeart(targetDiv) {
  const heart = document.createElement('div');
  heart.className = 'pulse-heart';
  heart.setAttribute('aria-hidden', 'true');
  heart.textContent = '💗';
  targetDiv.insertAdjacentElement('afterend', heart);
}

// -- EVENT LISTENERS (one-time explosion vs. future soft bursts) --
function onGiftTap(e) {
  if (exploded) {
    // After explosion, ignore taps (optional: soft burst allowed after final? add here if you wish)
    e.preventDefault();
    return false;
  }
  handleGiftExplosion();
}

// Touch/click: only one tap ever gets explosion!
giftBtn.addEventListener('click', onGiftTap, { once: true });
giftBtn.addEventListener('touchstart', function(e){
  e.preventDefault();
  onGiftTap(e);
}, { once: true, passive: false });

// Optional: allow soft bursts after explosion, e.g. after all messages shown
// Example: Uncomment this to allow soft bursts if the user taps the still-visible white screen
/*
document.body.addEventListener('click', function(e) {
  if (exploded && messageSequenceScreen && e.target === messageSequenceScreen) {
    softBurstFromGift();
  }
});
*/

// -- END --