const lotusRainBg = document.querySelector('.lotus-rain-bg');
const screenW = window.innerWidth;
const screenH = window.innerHeight;

const NUM_LOTUS = parseInt(lotusRainBg.dataset.count) || 30;
const SPEED_MULT = parseFloat(lotusRainBg.dataset.speed) || 1.0;
const MAX_OPACITY = parseFloat(lotusRainBg.dataset.opacity) || 1.0;

const lotusEmojis = [];
const lotusImageSrc = 'img/mini-lotus.png'; // <-- your lotus image path

function createLotus(index) {
  const lotus = document.createElement('span');
  lotus.className = 'lotus-flower';
  lotus.style.left = `${Math.random() * (screenW - 32)}px`;
  lotus.style.top = `${-Math.random() * 80}px`;
  const size = 22 + Math.random() * 18;
  lotus.style.width = lotus.style.height = `${size}px`;
  lotus.style.opacity = MAX_OPACITY;

  // --- USE AN IMAGE ---
  const img = document.createElement('img');
  img.src = lotusImageSrc;
  img.alt = 'Lotus';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.borderRadius = '50%';
  img.style.animation = `lotus-spin ${2.5 + Math.random() * 2.5}s linear infinite`;
  lotus.appendChild(img);

  lotusRainBg.appendChild(lotus);
  lotusEmojis.push({ 
    el: lotus, 
    speed: (1.2 + Math.random() * 1.5) * SPEED_MULT,
    fadeStart: screenH * 0.7 
  });
}

for (let i = 0; i < NUM_LOTUS; i++) {
  createLotus(i);
}

function animateLotusRain() {
  for (const lotus of lotusEmojis) {
    const el = lotus.el;
    let top = parseFloat(el.style.top) || 0;
    top += lotus.speed;
    el.style.top = `${top}px`;

    if (top > lotus.fadeStart) {
      const fade = Math.max(0, MAX_OPACITY - (top - lotus.fadeStart) / (screenH * 0.3) * MAX_OPACITY);
      el.style.opacity = `${fade}`;
    } else {
      el.style.opacity = MAX_OPACITY;
    }

    if (top > screenH) {
      el.style.left = `${Math.random() * (window.innerWidth - 32)}px`;
      el.style.top = `${-Math.random() * 80}px`;
      const size = 22 + Math.random() * 18;
      el.style.width = el.style.height = `${size}px`;
      if (el.firstChild && el.firstChild.tagName === 'IMG') {
        el.firstChild.style.animation = `lotus-spin ${2.5 + Math.random() * 2.5}s linear infinite`;
      }
      lotus.speed = (1.2 + Math.random() * 1.5) * SPEED_MULT;
    }
  }
  requestAnimationFrame(animateLotusRain);
}
animateLotusRain();

window.addEventListener('resize', () => {
  for (const lotus of lotusEmojis) {
    lotus.el.style.left = `${Math.random() * (window.innerWidth - 32)}px`;
  }
});