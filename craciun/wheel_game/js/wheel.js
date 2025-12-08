// Canvas-based dynamic spin wheel (mobile optimized)
// Folder: /craciun/wheel_game/js/wheel.js
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Configuration ----------
  const challenges = [
    "Do a jolly ‘Ho‑Ho‑Ho’ like Santa",
    "Pretend to wrap an invisible present for 5s",
    "Do a snowflake dance twirl",
    "Make your best Christmas tree pose",
    "Pretend you're cold like ❄️ for 3s",
    "Do a reindeer antler gesture with your hands",
    "Say “Crăciun Fericit!” dramatically",
    "Pretend you're throwing imaginary snowballs",
    "3s of jingle-bell hand shaking",
    "Mimic a gingerbread man walking",
    "Quick cozy self‑hug motion",
    "Sing a few notes of a Christmas jingle"
  ];
  // Audio (optional)
  const bellAudioSrc = '../misc/bell.mp3';
  const spinAudioSrc = '../misc/spin.wav';

  // DOM
  const canvas = document.getElementById('wheel-canvas');
  const container = document.getElementById('wheel-container');
  const spinBtn = document.getElementById('spin-btn');
  const popup = document.getElementById('result-popup');
  const resultText = document.getElementById('result-text');
  const againBtn = document.getElementById('again-btn');
  const toNextBtn = document.getElementById('to-next-btn');
  const falling = document.getElementById('falling-elements-wheel');

  // state
  let ctx, DPR = Math.max(1, window.devicePixelRatio || 1);
  let size = 0;
  let center = { x: 0, y: 0 }, radius = 0;
  let currentRotation = 0; // degrees
  let spinning = false;
  const numSlices = challenges.length;
  const sliceAngle = 360 / numSlices;

  // preload audio
  const bell = new Audio(bellAudioSrc);
  const spinAudio = new Audio(spinAudioSrc);
  bell.volume = 0.6;
  spinAudio.volume = 0.5;

  // snow nodes holder
  let snowNodes = [];

  // ---------- Canvas sizing & drawing ----------
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    size = Math.min(rect.width, rect.height);
    // ensure square sizing and center
    canvas.width = Math.floor(size * DPR);
    canvas.height = Math.floor(size * DPR);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    if (!ctx) ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    center = { x: size / 2, y: size / 2 };
    radius = (size / 2) * 0.92; // leave padding
    drawWheel();
    // keep container transform consistent with rotation state
    container.style.transform = `rotate(${currentRotation}deg)`;
  }

  // drawing helpers...
  const sliceColors = ['#D33','#2EA32E','#EFBF2D','#ffffff','#c72b2b','#2c8a2c'];
  function drawWheel() {
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((currentRotation * Math.PI) / 180);
    const angleRad = (2 * Math.PI) / numSlices;
    for (let i = 0; i < numSlices; i++) {
      const start = (i * angleRad) - Math.PI/2;
      const end = start + angleRad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end, false);
      ctx.closePath();
      ctx.fillStyle = sliceColors[i % sliceColors.length];
      ctx.globalAlpha = 0.98;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = Math.max(1, size * 0.0045);
      ctx.stroke();
      drawSliceText(i, start, end);
    }
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 1.03, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(6, size * 0.02);
    ctx.strokeStyle = 'rgba(250,230,150,0.18)';
    ctx.stroke();
  }
  function drawSliceText(index, start, end) {
    const mid = (start + end) / 2;
    const text = challenges[index];
    const maxWidth = radius * 0.62;
    const fontSize = Math.max(12, Math.floor(size * 0.035));
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(mid);
    ctx.fillStyle = (index % 2 === 0) ? '#fff' : '#111';
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (ctx.measureText(text).width <= maxWidth) {
      ctx.fillText(text, radius * 0.58, 0);
    } else {
      const words = text.split(' ');
      const midIdx = Math.ceil(words.length / 2);
      const first = words.slice(0, midIdx).join(' ');
      const second = words.slice(midIdx).join(' ');
      ctx.fillText(first, radius * 0.52, -fontSize * 0.6);
      ctx.fillText(second, radius * 0.52, fontSize * 0.9);
    }
    ctx.restore();
  }

  // ---------- Spin mechanics ----------
  function setContainerRotation(deg) {
    container.style.transform = `rotate(${deg}deg)`;
  }
  function pickRandomIndex() { return Math.floor(Math.random() * numSlices); }
  function spinToIndex(index) {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    try { spinAudio.currentTime = 0; spinAudio.play(); } catch(e){}
    const spins = 4 + Math.floor(Math.random() * 4); // 4..7
    const targetRelative = index * sliceAngle + (sliceAngle / 2);
    const target = (spins * 360) + targetRelative;
    const finalRotation = currentRotation - target;
    container.style.transition = `transform 4200ms cubic-bezier(.08,.75,.22,1)`;
    setContainerRotation(finalRotation);
    const onEnd = () => {
      container.removeEventListener('transitionend', onEnd);
      currentRotation = ((finalRotation % 360) + 360) % 360;
      container.style.transition = '';
      setTimeout(() => {
        try { bell.currentTime = 0; bell.play(); } catch(e){}
        const landedIndex = computeLandingIndexFromRotation(currentRotation);
        showResult(landedIndex);
        spinning = false;
        spinBtn.disabled = false;
      }, 220);
    };
    container.addEventListener('transitionend', onEnd);
  }
  function computeLandingIndexFromRotation(rotationDeg) {
    const normalized = ((-rotationDeg % 360) + 360) % 360;
    const adjusted = (normalized + (sliceAngle / 2)) % 360;
    const idx = Math.floor(adjusted / sliceAngle);
    return (idx + numSlices) % numSlices;
  }

  // ---------- UI & effects ----------
  function showResult(index) {
    resultText.textContent = challenges[index];
    popup.classList.remove('hide');
    popup.setAttribute('aria-hidden', 'false');
    triggerSparkles();
  }
  function hideResult() {
    popup.classList.add('hide');
    popup.setAttribute('aria-hidden', 'true');
  }
  function triggerSparkles() {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'spark';
      el.style.position = 'absolute';
      el.style.left = (50 + (Math.random()-0.5)*40) + '%';
      el.style.top = (40 + (Math.random()-0.5)*25) + '%';
      el.style.fontSize = (14 + Math.random()*18) + 'px';
      el.style.opacity = '1';
      el.style.transform = `translateY(0) scale(1) rotate(${Math.random()*60}deg)`;
      el.textContent = ['✨','❄️','🎄','🎁'][Math.floor(Math.random()*4)];
      el.style.pointerEvents = 'none';
      el.style.transition = 'transform 900ms ease-out, opacity 900ms ease-out';
      document.body.appendChild(el);
      setTimeout(()=> {
        el.style.opacity = '0';
        el.style.transform = `translateY(-40px) rotate(${(Math.random()-0.5)*90}deg) scale(0.7)`;
      }, 30);
      setTimeout(()=> el.remove(), 980);
    }
  }

  // ---------- Optimized initLightSnow (full-screen, transform-based) ----------
  function clearLightSnow() {
    snowNodes.forEach(n => n.remove());
    snowNodes = [];
    if (falling) falling.innerHTML = '';
  }

  function initLightSnow(container, count = 30) {
    if (!container) return;
    clearLightSnow();

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'light-snow';
      s.textContent = Math.random() < 0.8 ? '❄️' : '✧';
      s.style.position = 'fixed';
      s.style.left = (Math.random() * viewportW) + 'px';
      s.style.top = (-20 - Math.random() * viewportH * 0.4) + 'px';
      s.style.fontSize = (8 + Math.random() * 16) + 'px';
      s.style.opacity = (0.15 + Math.random() * 0.4);
      s.style.pointerEvents = 'none';
      s.style.zIndex = '0';
      s.style.willChange = 'transform';
      s.dataset.speed = (0.15 + Math.random() * 0.5);
      s.dataset.drift = (-0.3 + Math.random() * 0.6);
      container.appendChild(s);
      snowNodes.push(s);
    }

    let animId;
    function tick() {
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      snowNodes.forEach(n => {
        let top = parseFloat(n.style.top);
        let left = parseFloat(n.style.left);
        const speed = parseFloat(n.dataset.speed);
        const drift = parseFloat(n.dataset.drift);

        top += speed;
        left += drift;

        if (top > viewportH + 20) {
          top = -30;
          left = Math.random() * viewportW;
        }
        if (left < -10) {
          left = viewportW + 10;
        }
        if (left > viewportW + 10) {
          left = -10;
        }

        n.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      });
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(animId);
    }, { passive: true });

    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(tick);
      }
    }, { passive: true });
  }

  // ---------- Event wiring & accessibility ----------
  let resizeTimer = null;
  function onResize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    resizeCanvas();
    // regenerate full-screen snow to adapt to new viewport
    initLightSnow(falling, 30);
  }
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 120);
  }, { passive: true });
  window.addEventListener('orientationchange', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 220);
  }, { passive: true });

  // spin actions
  spinBtn.addEventListener('click', () => {
    hideResult();
    const idx = Math.floor(Math.random() * numSlices);
    spinToIndex(idx);
  }, { passive: true });

  againBtn.addEventListener('click', () => {
    hideResult();
    setTimeout(() => {
      const idx = Math.floor(Math.random() * numSlices);
      spinToIndex(idx);
    }, 220);
  }, { passive: true });

  toNextBtn.addEventListener('click', () => {
    window.location.href = '/craciun/index.html';
  }, { passive: true });

  spinBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      spinBtn.click();
    }
  });

  // ---------- Init drawing & start (overlay removed) ----------
  resizeCanvas();
  initLightSnow(falling, 30);  // Start snow right away, 30 flakes for mobile
  spinBtn.disabled = false;    // Enable spin button immediately for testing

  // expose debug redraw
  window.__spinWheelRedraw = () => drawWheel();
});