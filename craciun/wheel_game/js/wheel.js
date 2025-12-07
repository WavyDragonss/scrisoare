// Canvas-based dynamic spin wheel (mobile optimized)
// Folder: /spin_wheel_game/js/wheel.js
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
  const startOverlay = document.getElementById('start-overlay');
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

  // ---------- Start overlay handling ----------
  function showStartOverlay() {
    startOverlay.classList.add('visible');
    startOverlay.setAttribute('aria-hidden', 'false');
    spinBtn.disabled = true;
  }
  function hideStartOverlay() {
    startOverlay.classList.remove('visible');
    startOverlay.setAttribute('aria-hidden', 'true');
    spinBtn.disabled = false;
  }
  // overlay tap starts the page (and removes blur)
  startOverlay.addEventListener('click', () => {
    hideStartOverlay();
    // start light snow
    initLightSnow(falling, 18);
  }, { once: true, passive: true });

  // show overlay initially
  showStartOverlay();

  // ---------- Canvas sizing & drawing ----------
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    size = Math.min(rect.width, rect.height);
    canvas.width = Math.floor(size * DPR);
    canvas.height = Math.floor(size * DPR);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    if (!ctx) ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    center = { x: size / 2, y: size / 2 };
    radius = (size / 2) * 0.92; // leave padding
    drawWheel();
  }

  // colors for slices (cycled)
  const sliceColors = ['#D33',' #2EA32E','#EFBF2D','#ffffff','#c72b2b','#2c8a2c'];

  function drawWheel() {
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);

    // draw outer decorative ring
    const outerR = radius * 1.03;
    ctx.save();
    ctx.translate(center.x, center.y);
    // rotate to currentRotation
    ctx.rotate((currentRotation * Math.PI) / 180);
    // draw slices
    const angleRad = (2 * Math.PI) / numSlices;
    for (let i = 0; i < numSlices; i++) {
      const start = (i * angleRad) - Math.PI/2;
      const end = start + angleRad;
      // fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end, false);
      ctx.closePath();
      ctx.fillStyle = sliceColors[i % sliceColors.length].trim();
      ctx.globalAlpha = 0.98;
      ctx.fill();

      // small separator line
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = Math.max(1, size * 0.0045);
      ctx.stroke();
      // draw text for the slice
      drawSliceText(i, start, end);
    }

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8';
    ctx.globalAlpha = 0.06;
    ctx.fill();

    ctx.restore();

    // decorative ring (outside)
    ctx.beginPath();
    ctx.arc(center.x, center.y, outerR, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(6, size * 0.02);
    ctx.strokeStyle = 'rgba(250,230,150,0.18)';
    ctx.stroke();
  }

  function drawSliceText(index, start, end) {
    const mid = (start + end) / 2;
    const text = challenges[index];
    const maxWidth = radius * 0.7;
    const fontSize = Math.max(12, Math.floor(size * 0.04)); // scale with size
    ctx.save();
    ctx.translate(0, 0);
    ctx.fillStyle = index % 2 === 0 ? '#fff' : '#111';
    // place text along radial line: rotate to mid angle and draw text at radial position
    ctx.rotate(mid);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // measure and wrap if needed (very simple)
    const words = text.split(' ');
    // try single-line first
    let attempt = text;
    let measured = ctx.measureText(attempt).width;
    if (measured <= maxWidth) {
      ctx.fillText(attempt, radius * 0.6, 0);
    } else {
      // try two lines
      const first = words.slice(0, Math.ceil(words.length/2)).join(' ');
      const second = words.slice(Math.ceil(words.length/2)).join(' ');
      ctx.fillText(first, radius * 0.55, -fontSize * 0.6);
      ctx.fillText(second, radius * 0.55, fontSize * 0.8);
    }
    ctx.restore();
  }

  // ---------- Spin mechanics ----------
  // Use CSS transform on the canvas container (rotate(deg)) for smooth GPU animation
  function setContainerRotation(deg) {
    container.style.transform = `rotate(${deg}deg)`;
  }

  // pick a random index and spin
  function pickRandomIndex() {
    return Math.floor(Math.random() * numSlices);
  }

  function spinToIndex(index) {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    // small spin sound
    try { spinAudio.currentTime = 0; spinAudio.play(); } catch(e){}

    const spins = 4 + Math.floor(Math.random() * 4); // 4..7
    // targetRelative: angle from slice 0 to center of chosen slice (degrees)
    const targetRelative = index * sliceAngle + (sliceAngle / 2);
    const target = (spins * 360) + targetRelative;
    const finalRotation = currentRotation - target; // negative rotation to move slices upward under pointer

    // animate via CSS transition for GPU acceleration
    container.style.transition = `transform 4200ms cubic-bezier(.08,.75,.22,1)`;
    setContainerRotation(finalRotation);

    const onEnd = () => {
      container.removeEventListener('transitionend', onEnd);
      // set internal rotation and remove transition to keep control
      currentRotation = ((finalRotation % 360) + 360) % 360;
      container.style.transition = '';
      // small settle delay
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

  // Given currentRotation (normalized 0..360), compute which slice is aligned with the pointer at top
  function computeLandingIndexFromRotation(rotationDeg) {
    // rotationDeg is wheel rotation (0..360), positive clockwise applied to container
    // Our drawing places slice 0 starting at -90deg; center of slice i is angle: i*sliceAngle + sliceAngle/2
    // We used formula finalRotation = currentRotation - target, so compute normalized as:
    const normalized = ((-rotationDeg % 360) + 360) % 360;
    const adjusted = (normalized + (sliceAngle / 2)) % 360;
    const idx = Math.floor(adjusted / sliceAngle);
    // clamp
    return (idx + numSlices) % numSlices;
  }

  // ---------- UI for result ----------
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

  // ---------- Sparkles & light snow ----------
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

  // lightweight falling snow generator for this page
  function initLightSnow(container, count=18) {
    if (!container) return;
    container.innerHTML = '';
    const W = window.innerWidth, H = window.innerHeight;
    for (let i=0;i<count;i++) {
      const s = document.createElement('span');
      s.className = 'light-snow';
      s.textContent = Math.random()<0.8 ? '❄️' : '✧';
      s.style.position = 'fixed';
      s.style.left = (Math.random()*100) + 'vw';
      s.style.top = (-20 - Math.random()*60) + 'vh';
      s.style.fontSize = (10 + Math.random()*18) + 'px';
      s.style.opacity = 0.18 + Math.random()*0.35;
      s.style.pointerEvents = 'none';
      s.style.zIndex = 6;
      s.dataset.speed = (0.2 + Math.random()*0.6);
      container.appendChild(s);
    }
    // animate
    function tick(){
      const nodes = container.querySelectorAll('.light-snow');
      const W = window.innerWidth, H = window.innerHeight;
      nodes.forEach(n => {
        let top = parseFloat(n.style.top);
        let left = parseFloat(n.style.left);
        const speed = parseFloat(n.dataset.speed);
        top += speed + Math.random()*0.6;
        left += (Math.random()-0.5)*0.6;
        if (top > H + 10) {
          top = -10 - Math.random()*60;
          left = Math.random()*W;
        }
        if (left < -10) left = W + 10;
        if (left > W + 10) left = -10;
        n.style.top = top + 'px';
        n.style.left = left + 'px';
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- Event wiring ----------
  // Resize handling
  window.addEventListener('resize', () => {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    resizeCanvas();
  });

  // spin actions (buttons may be disabled until overlay dismissed)
  spinBtn.addEventListener('click', () => {
    hideResult();
    const idx = Math.floor(Math.random() * numSlices);
    spinToIndex(idx);
  });

  againBtn.addEventListener('click', () => {
    hideResult();
    setTimeout(() => {
      const idx = Math.floor(Math.random() * numSlices);
      spinToIndex(idx);
    }, 220);
  });

  toNextBtn.addEventListener('click', () => {
    // navigate to next screen - default goes to root craciun index
    window.location.href = '/craciun/index.html';
  });

  // keyboard accessibility
  spinBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      spinBtn.click();
    }
  });

  // ---------- Init drawing and start ----------
  resizeCanvas();
  // initial draw already done in resizeCanvas
  // overlay tap will call initLightSnow + allow spinning

  // in case we want to allow pressing space to start while overlay present:
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && startOverlay.classList.contains('visible')) {
      hideStartOverlay();
      initLightSnow(falling, 18);
    }
  });

  // expose for debugging globally
  window.__spinWheelRedraw = () => drawWheel();

});