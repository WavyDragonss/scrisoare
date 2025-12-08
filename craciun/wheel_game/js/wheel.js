// craciun/wheel_game/js/wheel.js
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

  // DOM
  const canvas = document.getElementById('wheel-canvas');
  const container = document.getElementById('wheel-container');
  const spinBtn = document.getElementById('spin-btn');
  const popup = document.getElementById('result-popup');
  const resultText = document.getElementById('result-text');
  const againBtn = document.getElementById('again-btn');
  const toNextBtn = document.getElementById('to-next-btn');
  const falling = document.getElementById('falling-elements-wheel');

  // Debug logs for missing elements
  console.log('Canvas element:', canvas);
  console.log('Container element:', container);
  console.log('Falling snow element:', falling);
  console.log('Spin button element:', spinBtn);

  // state & drawing
  let ctx, DPR = Math.max(1, window.devicePixelRatio || 1);
  let size = 0;
  let center = { x: 0, y: 0 }, radius = 0;
  let currentRotation = 0;
  let spinning = false;
  const numSlices = challenges.length;
  const sliceAngle = 360 / numSlices;

  // Lazy-loaded audio placeholders
  let bell = null;
  let spinAudio = null;
  let audioReady = false;
  function loadAudio() {
    if (audioReady) return;
    try {
      bell = new Audio('../misc/bell.mp3');
      spinAudio = new Audio('../misc/spin.wav');
      bell.volume = 0.6;
      spinAudio.volume = 0.5;
    } catch (e) {
      console.warn('Audio load failed', e);
    }
    audioReady = true;
  }

  // ---------- Canvas sizing & drawing ----------
  function resizeCanvas() {
    if (!container || !canvas) return;
    const rect = container.getBoundingClientRect();
    size = Math.min(rect.width, rect.height);
    canvas.width = Math.floor(size * DPR);
    canvas.height = Math.floor(size * DPR);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    if (!ctx) ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    center = { x: size / 2, y: size / 2 };
    radius = (size / 2) * 0.92;
    drawWheel();
    container.style.transform = `rotate(${currentRotation}deg)`;
  }

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

  function pickRandomIndex() {
    return Math.floor(Math.random() * numSlices);
  }

  function spinToIndex(index) {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    try { if (spinAudio) { spinAudio.currentTime = 0; spinAudio.play(); } } catch(e){}
    const spins = 4 + Math.floor(Math.random() * 4);
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
        try { if (bell) { bell.currentTime = 0; bell.play(); } } catch(e){}
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

  // ---------- UI ----------
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

  // ---------- Snow helpers (clear/regenerate) ----------
  function clearLightSnow() {
    snowNodes.forEach(n => n.remove());
    snowNodes = [];
    if (falling) falling.innerHTML = '';
  }

  // initLightSnow is provided by js/snow.js (already loaded). If not present, provide a fallback.
  if (typeof initLightSnow !== 'function') {
    console.warn('initLightSnow not found (snow.js not loaded). Using fallback simple snow generator.');
    function initLightSnow(container, count = 30) {
      if (!container) return;
      // very small fallback (non-optimized)
      container.innerHTML = '';
      for (let i=0;i<count;i++){
        const s = document.createElement('span');
        s.className='light-snow';
        s.textContent='❄️';
        s.style.position='fixed';
        s.style.left=(Math.random()*100)+'vw';
        s.style.top=(-10-Math.random()*50)+'vh';
        s.style.fontSize=(8+Math.random()*12)+'px';
        s.style.opacity=0.2+Math.random()*0.4;
        s.style.pointerEvents='none';
        container.appendChild(s);
      }
    }
  }

  // ---------- Event wiring ----------
  let resizeTimer = null;
  function onResize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    resizeCanvas();
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

  // spin button: lazy load audio then spin
  spinBtn.addEventListener('click', (ev) => {
    if (!audioReady) loadAudio();
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

  // ---------- Init drawing & start ----------
  console.log('Initializing wheel...');
  resizeCanvas();
  console.log('Canvas resized, size:', size);

  // Ensure resize handler is active (already wired above)
  window.addEventListener('resize', () => {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    resizeCanvas();
  });

  // Start snow and enable button shortly after load
  setTimeout(() => {
    if (falling) {
      initLightSnow(falling, 30);
      console.log('Snow initialized');
    }
    spinBtn.disabled = false;
  }, 100);
});