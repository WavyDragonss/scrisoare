// -- ELEMENTS --
const giftBtn = document.querySelector('.gift-btn');
const emojiContainer = document.querySelector('.emoji-container');
const messageDiv = document.querySelector('.romantic-message');
const mainWrapper = document.querySelector('.main-wrapper');

// For message sequence overlay
let whiteTransitionScreen, messageSequenceScreen, collageSection;
let musicAudio;

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
// List your collage images here (numbered, add more as needed)
const COLLAGE_IMAGES = [
  ['1.jpg', '2.jpg'], // row 1 (2 per row)
  ['3.jpg', '4.jpg'],
  ['5.jpg'],          // row 3 (single)
  ['6.jpg', '7.jpg'],
  ['8.jpg', '9.jpg']
];
const FIRST_EXPLODE_COUNT = 18;
const FIRST_SPARKLE_COUNT = 16;
const BURST_COUNT = 7;

// -- STATE --
let exploded = false;

// -- INTERACTION: EMOJI PARTICLE GENERATOR (unchanged; see previous code) --
function createExplosionParticle(type = "emoji") {
  // ...same as previous script...
  const isEmoji = type === "emoji";
  const set = isEmoji ? burstEmojis : burstSparkles;
  const el = document.createElement('span');
  el.className = isEmoji ? 'burst-emoji explode' : 'burst-sparkle explode';
  el.textContent = set[Math.floor(Math.random() * set.length)];
  const theta = Math.random() * 2 * Math.PI;
  const dist = (110 + Math.random() * 54);
  const tx = Math.cos(theta) * dist;
  const ty = Math.sin(theta) * dist;
  const rot = -40 + Math.random() * 80;
  const scale = 1.18 + Math.random() * 0.62;
  el.style.setProperty('--tx', `${tx}px`);
  el.style.setProperty('--ty', `${ty}px`);
  el.style.setProperty('--rot', `${rot}deg`);
  el.style.setProperty('--scale', scale);
  el.style.fontSize = (isEmoji ? (8 + Math.random()*3) : (3 + Math.random()*2)) + 'vw';
  emojiContainer.appendChild(el);
  el.addEventListener('animationend', () => { if (el.parentNode) el.parentNode.removeChild(el); });
}
function createSoftBurstParticle() {
  // ...same as before...
  const el = document.createElement('span');
  el.className = 'burst-emoji burst';
  el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
  const xOff = (-65 + Math.random() * 130);
  const yOff = -68 - Math.random() * 90;
  const rot = -22 + Math.random() * 44;
  const scale = 0.99 + Math.random() * 0.46;
  el.style.setProperty('--x', `${xOff}px`);
  el.style.setProperty('--y', `${yOff}px`);
  el.style.setProperty('--rot', `${rot}deg`);
  el.style.setProperty('--scale', scale);
  el.style.fontSize = (7 + Math.random()*2.6) + 'vw';
  emojiContainer.appendChild(el);
  el.addEventListener('animationend', () => { if (el.parentNode) el.parentNode.removeChild(el); });
}

// -- FIRST TAP: SLOW PACE, EXPLOSION, FADE, THEN MESSAGES+MUSIC --
function handleGiftExplosion() {
  exploded = true;
  giftBtn.classList.add('explode');
  vibrate(26);
  for (let i = 0; i < FIRST_EXPLODE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("emoji"), Math.random()*150);
  for (let i = 0; i < FIRST_SPARKLE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("sparkle"), 25+Math.random()*100);

  // Let explosion play for 1.7s, then slow fade
  setTimeout(() => {
    // Hide the gift and background content
    giftBtn.classList.add('hide');
    mainWrapper.style.transition = "opacity 1.5s cubic-bezier(.47,0,.58,1)";
    mainWrapper.style.opacity = "0";

    // Create white overlay
    if (!whiteTransitionScreen) {
      whiteTransitionScreen = document.createElement('div');
      whiteTransitionScreen.className = 'white-transition';
      document.body.appendChild(whiteTransitionScreen);
      // Trigger slow fade in
      setTimeout(()=>whiteTransitionScreen.classList.add('active'), 90);
    } else {
      whiteTransitionScreen.classList.add('active');
    }

    // Remove all burst particles just before fade completes
    setTimeout(() => { emojiContainer.innerHTML = ''; }, 1100);

    // Wait for fade-in to be full (~1.7s + 1.5s = ~3.2s to white)
    setTimeout(startMusicAndMessages, 1550);
  }, 1700);
}

// -- SUBSEQUENT TAPS: SOFT BURST (if you want, not by default here) --
// function softBurstFromGift() { ... unchanged ... }

// -- VIBRATE SUPPORT --
function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms || 20); }

// -- MUSIC: fade in after white, keep playing through collage --
function playMusic() {
  // Place your mp3/ogg in a 'music.mp3' file in /1year/
  if (!musicAudio) {
    musicAudio = document.createElement('audio');
    musicAudio.src = 'music/song.mp3';
    musicAudio.loop = true;
    musicAudio.volume = 0.0; // will fade in
    document.body.appendChild(musicAudio);
  }
  musicAudio.play().catch(()=>{});
  let vol = 0;
  const fade = setInterval(()=>{
    vol += 0.05;
    musicAudio.volume = Math.min(vol, 0.58);
    if(vol >= 0.58) clearInterval(fade);
  }, 110);
}

// -- MESSAGES BEGIN AFTER WHITE IS FULLY SHOWN --
function startMusicAndMessages() {
  // Fade-in music
  playMusic();

  // Hide main UI elements, fade in message overlay
  mainWrapper.style.display = "none";
  // Message overlay
  if (!messageSequenceScreen) {
    messageSequenceScreen = document.createElement('div');
    messageSequenceScreen.className = 'message-sequence';
    document.body.appendChild(messageSequenceScreen);
  } else {
    messageSequenceScreen.innerHTML = '';
  }
  document.body.style.overflow = "hidden";
  window.scrollTo(0,0);

  // Show messages in sequence
  let idx = 0;
  function showNextMsg() {
    // Remove previous
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
    setTimeout(()=>mDiv.classList.add('active'), 80);
    // Next step
    if (idx < MESSAGES.length - 1) {
      idx++;
      setTimeout(showNextMsg, 3200 + Math.random()*800);
    } else {
      // Final: show heart under, then collage
      setTimeout(() => pulseHeart(mDiv), 1000);
      setTimeout(() => showCollage(messageSequenceScreen, mDiv), 2900);
    }
  }
  setTimeout(showNextMsg, 3200); // 1st message appears after 3.2s of white
}

// -- FINAL HEART UNDER LAST MESSAGE --
function pulseHeart(targetDiv) {
  const heart = document.createElement('div');
  heart.className = 'pulse-heart';
  heart.setAttribute('aria-hidden', 'true');
  heart.textContent = '💗';
  targetDiv.insertAdjacentElement('afterend', heart);
}

// -- COLLAGE REVEAL & INSERT --
function showCollage(msgScreen, lastMsgDiv) {
  // Animate last message upward to make room
  lastMsgDiv.style.transition = 'transform 1.1s cubic-bezier(.31,.67,.16,1)';
  lastMsgDiv.style.transform = 'translateY(-46px) scale(0.96)';
  const heart = msgScreen.querySelector('.pulse-heart');
  if (heart) heart.style.transform = 'translateY(-34px)';

  // Create divider heart
  setTimeout(() => {
    const divider = document.createElement('div');
    divider.className = 'collage-heart-divider';
    divider.textContent = '💗';
    msgScreen.appendChild(divider);

    // Insert collage section
    collageSection = document.createElement('section');
    collageSection.className = 'collage-section';
    msgScreen.appendChild(collageSection);
    // Generate rows and images
    COLLAGE_IMAGES.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'collage-row';
      row.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.className = 'collage-image';
        imgEl.src = `images/${img}`;
        imgEl.alt = "";
        // Reveal on scroll
        rowDiv.appendChild(imgEl);
      });
      collageSection.appendChild(rowDiv);
    });

    // Enable scrolling
    setTimeout(()=>{ document.body.style.overflow='auto';}, 650);

    // Animate-in as user scrolls
    setTimeout(setupCollageReveal, 1);

  }, 900);
}

// Collage images reveal on scroll
function setupCollageReveal() {
  const imgs = Array.from(document.querySelectorAll('.collage-image'));
  const showIfVisible = () => {
    const winH = window.innerHeight;
    imgs.forEach(img => {
      if (img.classList.contains('visible')) return;
      const rect = img.getBoundingClientRect();
      if (rect.top < winH - 40) img.classList.add('visible');
    });
  };
  window.addEventListener('scroll', showIfVisible, {passive: true});
  showIfVisible();
}

// -- EVENT LISTENERS --
function onGiftTap(e) {
  if (exploded) return false;
  handleGiftExplosion();
}
giftBtn.addEventListener('click', onGiftTap, { once: true });
giftBtn.addEventListener('touchstart', function(e){
  e.preventDefault();
  onGiftTap(e);
}, { once: true, passive: false });