const lotusRainBg = document.querySelector('.lotus-rain-bg');
const screenW = window.innerWidth;
const screenH = window.innerHeight;

// Read parameters from data attributes with defaults
const NUM_LOTUS = parseInt(lotusRainBg.dataset.count) || 30;
const SPEED_MULT = parseFloat(lotusRainBg.dataset.speed) || 1.0;
const MAX_OPACITY = parseFloat(lotusRainBg.dataset.opacity) || 1.0;

const lotusEmojis = [];

// Utility to create a lotus flower
function createLotus(index) {
  const lotus = document.createElement('span');
  lotus.textContent = '🌸';
  lotus.className = 'lotus-flower';
  lotus.style.position = 'absolute';
  lotus.style.left = `${Math.random() * (screenW - 32)}px`;
  lotus.style.top = `${-Math.random() * 80}px`;
  const size = 22 + Math.random() * 18;
  lotus.style.fontSize = `${size}px`;
  lotus.style.opacity = MAX_OPACITY;
  lotusRainBg.appendChild(lotus);
  lotusEmojis.push({ 
    el: lotus, 
    speed: (1.2 + Math.random() * 1.5) * SPEED_MULT, 
    fadeStart: screenH * 0.7 
  });
}

// Initial lotus creation
for (let i = 0; i < NUM_LOTUS; i++) {
  createLotus(i);
}

// Animate the lotus flowers
function animateLotusRain() {
  for (const lotus of lotusEmojis) {
    const el = lotus.el;
    let top = parseFloat(el.style.top) || 0;
    top += lotus.speed;
    el.style.top = `${top}px`;

    // Fade out near the bottom
    if (top > lotus.fadeStart) {
      const fade = Math.max(0, MAX_OPACITY - (top - lotus.fadeStart) / (screenH * 0.3) * MAX_OPACITY);
      el.style.opacity = `${fade}`;
    } else {
      el.style.opacity = MAX_OPACITY;
    }

    // Reset when out of view
    if (top > screenH) {
      el.style.left = `${Math.random() * (window.innerWidth - 32)}px`;
      el.style.top = `${-Math.random() * 80}px`;
      const size = 22 + Math.random() * 18;
      el.style.fontSize = `${size}px`;
      lotus.speed = (1.2 + Math.random() * 1.5) * SPEED_MULT;
    }
  }
  requestAnimationFrame(animateLotusRain);
}

animateLotusRain();

// Responsive: update positions on resize
window.addEventListener('resize', () => {
  for (const lotus of lotusEmojis) {
    lotus.el.style.left = `${Math.random() * (window.innerWidth - 32)}px`;
  }
});