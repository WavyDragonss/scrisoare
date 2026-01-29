const giftBtn = document.querySelector('.gift-btn');
const emojiContainer = document.querySelector('.emoji-container');
const mainWrapper = document.querySelector('.main-wrapper');

let whiteTransitionScreen, messageSequenceScreen, collageSection, musicAudio;

const burstEmojis = [ "💖", "❤️", "🥰", "🌸", "✨", "🫶", "😘", "💗", "💝" ];
const burstSparkles = [ "✨", "🩷", "🌸", "⭐️", "💫" ];
const MESSAGES = [
  "I can't believe it's already been a year.",
  "Every day with you feels new.",
  "You matter more to me than you'll ever know.",
  "I’d choose you again. Every single time.",
  "This is just the beginning. 💗"
];

// MAKE SURE YOU HAVE 35 images in images/1.jpg ... images/35.jpg
const COLLAGE_IMAGES = Array.from({length: 35}, (_, i) => `${i+1}.jpg`);
const FIRST_EXPLODE_COUNT = 18;
const FIRST_SPARKLE_COUNT = 16;
let exploded = false;

// Particle burst (as before)
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

function vibrate(ms) { if (navigator.vibrate) navigator.vibrate(ms || 20); }

// GIFT EXPLOSION + FADE + MESSAGES + COLLAGE
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

// Background music
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

// Messages, then Collage/Carousel
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
      setTimeout(() => showCollageCarousel(messageSequenceScreen, mDiv), 2900);
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

// --- COLLAGE CAROUSEL LOGIC ---
function showCollageCarousel(msgScreen, lastMsgDiv) {
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

    // carousel UI
    const carousel = document.createElement('div');
    carousel.className = 'carousel-wrapper';
    collageSection.appendChild(carousel);

    // Arrows
    const left = document.createElement('button');
    left.className = 'carousel-arrow';
    left.innerHTML = '‹';
    left.setAttribute('aria-label','Previous photo');

    const right = document.createElement('button');
    right.className = 'carousel-arrow';
    right.innerHTML = '›';
    right.setAttribute('aria-label','Next photo');

    // Image area
    const imgArea = document.createElement('div');
    imgArea.className = 'carousel-img-area';
    carousel.appendChild(left);
    carousel.appendChild(imgArea);
    carousel.appendChild(right);

    // Image elements for quick fade
    const imgEls = COLLAGE_IMAGES.map(src => {
      const el = document.createElement('img');
      el.className = 'carousel-img';
      el.src = `images/${src}`;
      el.alt = "";
      imgArea.appendChild(el);
      return el;
    });

    // Pager
    const pager = document.createElement('div');
    pager.className = 'carousel-pager';
    const dots = COLLAGE_IMAGES.map((img, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      pager.appendChild(dot);
      dot.addEventListener('click', ()=>showSlide(i));
      return dot;
    });
    carousel.appendChild(pager);
    function showCollage(msgScreen, lastMsgDiv) {
  // ... previous code to adjust messages/heart ...

  setTimeout(() => {
    // Create and append the section
    const collageSection = document.createElement('section');
    collageSection.className = 'collage-section';
    msgScreen.appendChild(collageSection);

    // Here is the key line – call the carousel!
    createCarousel('.collage-section');

    // Allow scrolling again
    setTimeout(() => { document.body.style.overflow = 'auto'; }, 750);
  }, 900);
}
    // Carousel logic
    let idx = 0;
    function showSlide(i) {
      idx = (i + COLLAGE_IMAGES.length) % COLLAGE_IMAGES.length;
      imgEls.forEach((imgEl, j) => {
        if(j === idx) imgEl.classList.add('visible');
        else imgEl.classList.remove('visible');
      });
      dots.forEach((dot,j)=>dot.classList.toggle('active',j===idx));
    }
    left.addEventListener('click', ()=>{showSlide(idx-1)});
    right.addEventListener('click', ()=>{showSlide(idx+1)});
    // Mobile swipe
    let sx, sy;
    imgArea.addEventListener('touchstart', (e)=>{
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, {passive:true});
    imgArea.addEventListener('touchend', (e)=>{
      if(sx !== undefined) {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = Math.abs(e.changedTouches[0].clientY - sy);
        if(Math.abs(dx)>40 && dy<80) {
          if(dx<0) showSlide(idx+1); else showSlide(idx-1);
        }
      }
      sx=undefined; sy=undefined;
    }, {passive:true});
    showSlide(0);

    setTimeout(()=>{document.body.style.overflow='auto'},700);
  }, 900);
}

// -- EVENTS --
function onGiftTap(e) {
  if (exploded) return false;
  handleGiftExplosion();
}
giftBtn.addEventListener('click', onGiftTap, { once: true });
giftBtn.addEventListener('touchstart', function(e){
  e.preventDefault();
  onGiftTap(e);
}, { once: true, passive: false });