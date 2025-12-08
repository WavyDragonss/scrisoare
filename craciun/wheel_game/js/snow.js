// craciun/wheel_game/js/snow.js
// Standalone, optimized snow engine used by wheel.js

function initLightSnow(container, count = 30) {
  if (!container) {
    console.warn('Snow container not found');
    return;
  }

  // Clear any previous snowflakes
  container.innerHTML = '';

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Create snowflakes
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'light-snow';
    s.textContent = Math.random() < 0.8 ? '❄️' : '✧';
    s.style.position = 'fixed';
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.top = (-20 - Math.random() * 60) + 'vh';
    s.style.fontSize = (8 + Math.random() * 16) + 'px';
    s.style.opacity = (0.15 + Math.random() * 0.4);
    s.style.pointerEvents = 'none';
    s.style.zIndex = '0';
    s.style.willChange = 'transform';
    s.dataset.speed = (0.15 + Math.random() * 0.5);
    s.dataset.drift = (-0.3 + Math.random() * 0.6);
    container.appendChild(s);
  }

  // Animation loop
  let animId;
  function tick() {
    const nodes = container.querySelectorAll('.light-snow');
    const vW = window.innerWidth;
    const vH = window.innerHeight;

    nodes.forEach(n => {
      let top = parseFloat(n.style.top);
      let left = parseFloat(n.style.left);
      const speed = parseFloat(n.dataset.speed);
      const drift = parseFloat(n.dataset.drift);

      top += speed;
      left += drift;

      if (top > vH + 20) {
        top = -30;
        left = Math.random() * vW;
      }
      if (left < -10) left = vW + 10;
      if (left > vW + 10) left = -10;

      n.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    });

    animId = requestAnimationFrame(tick);
  }

  animId = requestAnimationFrame(tick);

  // Cleanup handlers
  window.addEventListener('pagehide', () => cancelAnimationFrame(animId), { once: true });
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(tick);
    }
  });
}