// -- ELEMENTS --
const giftBtn = document.querySelector('.gift-btn');
const emojiContainer = document.querySelector('.emoji-container');
const messageDiv = document.querySelector('.romantic-message');
const mainWrapper = document.querySelector('.main-wrapper');

// For overlays, music, modal
let whiteTransitionScreen, messageSequenceScreen, collageSection, musicAudio;
let currentVideoModal = null;

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
// 35 photos, 1-based numbering; videos 1.mp4, 2.mp4 in videos/
const COLLAGE_IMAGES = [
  ['1.jpg', '2.jpg'], ['3.jpg', '4.jpg'], ['5.jpg', '6.jpg'], ['7.jpg', '8.jpg'],
  ['9.jpg', '10.jpg'], ['11.jpg', '12.jpg'], ['13.jpg', '14.jpg'], ['15.jpg', '16.jpg'],
  ['17.jpg', '18.jpg'], ['19.jpg', '20.jpg'], ['21.jpg', '22.jpg'], ['23.jpg', '24.jpg'],
  ['25.jpg', '26.jpg'], ['27.jpg', '28.jpg'], ['29.jpg', '30.jpg'], ['31.jpg', '32.jpg'],
  ['33.jpg', '34.jpg'], ['35.jpg']
];
const COLLAGE_VIDEOS = [
  '1.mp4', '2.mp4'
];
const FIRST_EXPLODE_COUNT = 18;
const FIRST_SPARKLE_COUNT = 16;
const BURST_COUNT = 7;
let exploded = false;

// ---- PARTICLE BURST ----
function createExplosionParticle(type = "emoji") {
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

// ---- GIFT EXPLOSION, PAGE FADE, THEN MESSAGES+MUSIC ----
function handleGiftExplosion() {
  exploded = true;
  giftBtn.classList.add('explode');
  vibrate(26);
  for (let i = 0; i < FIRST_EXPLODE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("emoji"), Math.random()*150);
  for (let i = 0; i < FIRST_SPARKLE_COUNT; ++i)
    setTimeout(() => createExplosionParticle("sparkle"), 25+Math.random()*100);

  setTimeout(() => {
    giftBtn.classList.add('hide');
    mainWrapper.style.transition = "opacity 1.5s cubic-bezier(.47,0,.58,1)";
    mainWrapper.style.opacity = "0";
    if (!whiteTransitionScreen) {
      whiteTransitionScreen = document.createElement('div');
      whiteTransitionScreen.className = 'white-transition';
      document.body.appendChild(whiteTransitionScreen);
      setTimeout(()=>whiteTransitionScreen.classList.add('active'), 90);
    } else {
      whiteTransitionScreen.classList.add('active');
    }
    setTimeout(() => { emojiContainer.innerHTML = ''; }, 1100);
    setTimeout(startMusicAndMessages, 1550);
  }, 1700);
}
function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms || 20); }

// ---- MUSIC (fade in after white, keep playing) ----
function playMusic() {
  if (!musicAudio) {
    musicAudio = document.createElement('audio');
    musicAudio.src = 'music/song.mp3';
    musicAudio.loop = true;
    musicAudio.volume = 0.0;
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

// ---- MESSAGE SEQUENCE, THEN COLLAGE ----
function startMusicAndMessages() {
  playMusic();
  mainWrapper.style.display = "none";
  if (!messageSequenceScreen) {
    messageSequenceScreen = document.createElement('div');
    messageSequenceScreen.className = 'message-sequence';
    document.body.appendChild(messageSequenceScreen);
  } else {
    messageSequenceScreen.innerHTML = '';
  }
  document.body.style.overflow = "hidden";
  window.scrollTo(0,0);
  let idx = 0;
  function showNextMsg() {
    const prev = messageSequenceScreen.querySelector('.sequence-message.active');
    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('exit');
      setTimeout(()=>{ if(prev.parentNode) prev.parentNode.removeChild(prev); }, 700);
    }
    const mDiv = document.createElement('div');
    mDiv.className = 'sequence-message';
    mDiv.textContent = MESSAGES[idx];
    messageSequenceScreen.appendChild(mDiv);
    setTimeout(()=>mDiv.classList.add('active'), 80);
    if (idx < MESSAGES.length - 1) {
      idx++;
      setTimeout(showNextMsg, 3200 + Math.random()*800);
    } else {
      setTimeout(() => pulseHeart(mDiv), 1000);
      setTimeout(() => showCollage(messageSequenceScreen, mDiv), 2900);
    }
  }
  setTimeout(showNextMsg, 3200);
}

function pulseHeart(targetDiv) {
  const heart = document.createElement('div');
  heart.className = 'pulse-heart';
  heart.setAttribute('aria-hidden', 'true');
  heart.textContent = '💗';
  targetDiv.insertAdjacentElement('afterend', heart);
}

// ---- COLLAGE (PHOTOS THEN VIDEOS) ----
function showCollage(msgScreen, lastMsgDiv) {
  lastMsgDiv.style.transition = 'transform 1.1s cubic-bezier(.31,.67,.16,1)';
  lastMsgDiv.style.transform = 'translateY(-46px) scale(0.96)';
  const heart = msgScreen.querySelector('.pulse-heart');
  if (heart) heart.style.transform = 'translateY(-34px)';
  setTimeout(() => {
    const divider = document.createElement('div');
    divider.className = 'collage-heart-divider';
    divider.textContent = '💗';
    msgScreen.appendChild(divider);

    collageSection = document.createElement('section');
    collageSection.className = 'collage-section';
    msgScreen.appendChild(collageSection);

    // photo collage
    COLLAGE_IMAGES.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'collage-row';
      row.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.className = 'collage-image';
        imgEl.src = `images/${img}`;
        imgEl.alt = "";
        rowDiv.appendChild(imgEl);
      });
      collageSection.appendChild(rowDiv);
    });

    // videos: divider + player
    if (COLLAGE_VIDEOS.length > 0) {
      const divider2 = document.createElement('div');
      divider2.className = 'collage-heart-divider';
      divider2.textContent = '💗';
      collageSection.appendChild(divider2);

      COLLAGE_VIDEOS.forEach((videoFile, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'collage-video-thumb';
        thumb.setAttribute('tabindex', '0');
        thumb.innerHTML = `<span class="video-play-btn">▶</span>`;
        thumb.addEventListener('click', () => openVideoPlayer(videoFile));
        thumb.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') openVideoPlayer(videoFile);
        });
        collageSection.appendChild(thumb);
      });
    }

    setTimeout(()=>{ document.body.style.overflow='auto';}, 650);
    setTimeout(setupCollageReveal, 30);
  }, 900);
}
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

// ---- SPECIAL VIDEO PLAYER ----
function openVideoPlayer(videoFile) {
  if (currentVideoModal) return;
  currentVideoModal = document.createElement('div');
  currentVideoModal.className = 'video-player-modal';
  currentVideoModal.innerHTML = `
    <video src="videos/${videoFile}" controls autoplay playsinline></video>
    <button class="close-modal-btn" aria-label="Close video" title="Close">✕</button>
  `;
  document.body.appendChild(currentVideoModal);
  const closeBtn = currentVideoModal.querySelector('.close-modal-btn');
  closeBtn.addEventListener('click', closeVideoPlayer);
  currentVideoModal.addEventListener('click', (e) => {
    if (e.target === currentVideoModal) closeVideoPlayer();
  });
  document.body.style.overflow = 'hidden';
}
function closeVideoPlayer() {
  if (currentVideoModal) {
    currentVideoModal.remove();
    currentVideoModal = null;
    document.body.style.overflow = 'auto';
  }
}

// ---- INITIAL EVENT ----
function onGiftTap(e) {
  if (exploded) return false;
  handleGiftExplosion();
}
giftBtn.addEventListener('click', onGiftTap, { once: true });
giftBtn.addEventListener('touchstart', function(e){
  e.preventDefault();
  onGiftTap(e);
}, { once: true, passive: false });