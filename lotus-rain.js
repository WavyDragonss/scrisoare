// Lotus rain system
const NUM_LOTUS = 30; // Adjust the number of lotus flowers here
const lotusRainBg = document.querySelector('.lotus-rain-bg');
const lotusEmojis = [];
const screenW = window.innerWidth;
const screenH = window.innerHeight;

// Utility to create a lotus flower
function createLotus(index) {
  const lotus = document.createElement('span');
  lotus.textContent = '🌸';
  lotus.className = 'lotus-flower';
  // Random horizontal position
  lotus.style.position = 'absolute';
  lotus.style.left = `${Math.random() * (screenW - 32)}px`;
  // Start position above the viewport
  lotus.style.top = `${-Math.random() * 80}px`;
  // Random size for natural look
  const size = 22 + Math.random() * 18;
  lotus.style.fontSize = `${size}px`;
  lotus.style.opacity = '1';
  lotusRainBg.appendChild(lotus);
  lotusEmojis.push({ el: lotus, speed: 1.2 + Math.random() * 1.5, fadeStart: screenH * 0.7 });
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
      const fade = Math.max(0, 1 - (top - lotus.fadeStart) / (screenH * 0.3));
      el.style.opacity = `${fade}`;
    } else {
      el.style.opacity = '1';
    }

    // Reset when out of view
    if (top > screenH) {
      el.style.left = `${Math.random() * (screenW - 32)}px`;
      el.style.top = `${-Math.random() * 80}px`;
      const size = 22 + Math.random() * 18;
      el.style.fontSize = `${size}px`;
      lotus.speed = 1.2 + Math.random() * 1.5;
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