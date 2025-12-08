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
  const continueBtn = document.getElementById('continue-btn');
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

  // Challenge tracking
  const completedChallenges = new Set();
  let activeChallenges = [...Array(numSlices).keys()]; // [0..numSlices-1]
  function getRemainingCount() { return activeChallenges.length; }
  function removeChallenge(index) {
    const pos = activeChallenges.indexOf(index);
    if (pos > -1) {
      activeChallenges.splice(pos, 1);
      completedChallenges.add(index);
      console.log(`Challenge ${index} removed. Remaining: ${activeChallenges.length}`);
    }
  }

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

  // Canvas & draw helpers (assume drawWheelOptimized and drawSliceText exist elsewhere in file)
  let ctxInitialized = false;
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
    drawWheelOptimized(activeChallenges.length);
    container.style.transform = `rotate(${currentRotation}deg)`;
    ctxInitialized = true;
  }

  const sliceColors = ['#D33','#2EA32E','#EFBF2D','#ffffff','#c72b2b','#2c8a2c'];

  function drawSliceText(index, start, end) {
    if (!ctx) return;
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

  function drawWheelOptimized(numActive) {
    if (!ctx) return;
    if (numActive <= 0) {
      ctx.clearRect(0, 0, size, size);
      return;
    }

    ctx.clearRect(0, 0, size, size);

    const activeSliceAngle = 360 / numActive;
    const outerR = radius * 1.03;
    const angleRad = (2 * Math.PI) / numActive;

    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((currentRotation * Math.PI) / 180);

    for (let i = 0; i < numActive; i++) {
      const actualIndex = activeChallenges[i];
      const start = (i * angleRad) - Math.PI / 2;
      const end = start + angleRad;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end, false);
      ctx.closePath();
      ctx.fillStyle = sliceColors[actualIndex % sliceColors.length].trim();
      ctx.globalAlpha = 0.98;
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = Math.max(1, size * 0.0045);
      ctx.stroke();

      // Draw text for this remaining challenge
      drawSliceText(actualIndex, start, end);
    }

    // inner circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8';
    ctx.globalAlpha = 0.06;
    ctx.fill();

    ctx.restore();

    // outer ring
    ctx.beginPath();
    ctx.arc(center.x, center.y, outerR, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(6, size * 0.02);
    ctx.strokeStyle = 'rgba(250,230,150,0.18)';
    ctx.stroke();
  }

  // ---------- compute landing based on currentRotation and active count ----------
  function computeLandingIndexFromRotation(rotationDeg, numActive = activeChallenges.length) {
    if (numActive <= 0) return 0;
    const activeSliceAngle = 360 / numActive;
    const normalized = ((-rotationDeg % 360) + 360) % 360;
    const adjusted = (normalized + (activeSliceAngle / 2)) % 360;
    const idx = Math.floor(adjusted / activeSliceAngle);
    return (idx + numActive) % numActive;
  }

  // ---------- Smooth spinToIndex (requestAnimationFrame) ----------
  function setContainerRotation(deg) {
    container.style.transform = `rotate(${deg}deg)`;
  }

  function spinToIndex(index) {
    if (spinning || activeChallenges.length === 0) return;
    spinning = true;
    spinBtn.disabled = true;

    // Ensure audio is loaded
    if (!audioReady) loadAudio();
    try { if (spinAudio) { spinAudio.currentTime = 0; spinAudio.play(); } } catch(e){ console.log('Spin audio failed:', e); }

    // Find position in activeChallenges
    const posInActive = activeChallenges.indexOf(index);
    if (posInActive === -1) {
      if (activeChallenges.length === 0) { spinning = false; spinBtn.disabled = false; return; }
      const randomPos = Math.floor(Math.random() * activeChallenges.length);
      spinToIndex(activeChallenges[randomPos]);
      return;
    }

    const numActive = activeChallenges.length;
    const activeSliceAngle = 360 / numActive;
    const spins = 4 + Math.floor(Math.random() * 4); // 4..7

    const targetRelative = posInActive * activeSliceAngle + (activeSliceAngle / 2);
    const targetRotation = (spins * 360) + targetRelative;

    const spinDuration = 4200;
    const startTime = performance.now();
    const startRotation = currentRotation;

    function animateSpin(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
      setContainerRotation(currentRotation);
      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        currentRotation = ((targetRotation % 360) + 360) % 360;
        setContainerRotation(currentRotation);
        setTimeout(() => {
          try { if (bell) { bell.currentTime = 0; bell.play(); } } catch(e){ console.log('Bell audio failed:', e); }
          const landedIndex = computeLandingIndexFromRotation(currentRotation, numActive);
          const actualChallengeIndex = activeChallenges[landedIndex];
          showResult(actualChallengeIndex);
          spinning = false;
          spinBtn.disabled = false;
        }, 220);
      }
    }

    requestAnimationFrame(animateSpin);
  }

  // ---------- showResult with task removal & button wiring ----------
  function showResult(actualIndex) {
    resultText.textContent = challenges[actualIndex];
    popup.classList.remove('hide');
    popup.setAttribute('aria-hidden', 'false');
    triggerSparkles();

    const remaining = getRemainingCount();
    const isLastTask = remaining === 1;

    // Clone buttons to remove previous listeners
    const newAgainBtn = againBtn.cloneNode(true);
    againBtn.parentNode.replaceChild(newAgainBtn, againBtn);
    const newToNextBtn = toNextBtn.cloneNode(true);
    toNextBtn.parentNode.replaceChild(newToNextBtn, toNextBtn);

    const currentAgainBtn = newAgainBtn;
    const currentToNextBtn = newToNextBtn;

    if (isLastTask) {
      currentAgainBtn.textContent = 'Completed ✓';
      currentAgainBtn.disabled = true;
      currentAgainBtn.style.opacity = '0.6';
      currentAgainBtn.style.cursor = 'default';
      currentToNextBtn.textContent = 'Continue';
    } else {
      currentAgainBtn.textContent = 'Spin Again';
      currentAgainBtn.disabled = false;
      currentAgainBtn.style.opacity = '1';
      currentAgainBtn.style.cursor = 'pointer';
      currentToNextBtn.textContent = 'Skip';
    }

    currentAgainBtn.addEventListener('click', () => {
      hideResult();
      removeChallenge(actualIndex);

      const newRemaining = getRemainingCount();

      if (newRemaining === 0) {
        popup.classList.add('hide');
        if (continueBtn) {
          continueBtn.classList.add('shown');
          continueBtn.style.display = 'inline-block';
          spinBtn.style.display = 'none';
        }
        return;
      }

      const shrinkFactor = Math.max(0.36, newRemaining / numSlices);
      container.style.transition = 'transform 0.5s ease';
      container.style.transform = `scale(${shrinkFactor}) rotate(${currentRotation}deg)`;

      setTimeout(() => { drawWheelOptimized(newRemaining); }, 520);

      setTimeout(() => {
        const nextIdx = Math.floor(Math.random() * activeChallenges.length);
        spinToIndex(activeChallenges[nextIdx]);
      }, 700);
    });

    currentToNextBtn.addEventListener('click', () => {
      if (isLastTask) {
        window.location.href = '../final_message/finish.html';
      } else {
        hideResult();
        removeChallenge(actualIndex);

        const newRemaining = getRemainingCount();
        if (newRemaining === 0) {
          popup.classList.add('hide');
          if (continueBtn) {
            continueBtn.classList.add('shown');
            continueBtn.style.display = 'inline-block';
            spinBtn.style.display = 'none';
          }
          return;
        }

        const shrinkFactor = Math.max(0.36, newRemaining / numSlices);
        container.style.transition = 'transform 0.5s ease';
        container.style.transform = `scale(${shrinkFactor}) rotate(${currentRotation}deg)`;

        setTimeout(() => { drawWheelOptimized(newRemaining); }, 320);

        setTimeout(() => {
          const nextIdx = Math.floor(Math.random() * activeChallenges.length);
          spinToIndex(activeChallenges[nextIdx]);
        }, 600);
      }
    });
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
      setTimeout(()=> { el.style.opacity = '0'; el.style.transform = `translateY(-40px) rotate(${(Math.random()-0.5)*90}deg) scale(0.7)`; }, 30);
      setTimeout(()=> el.remove(), 980);
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

  // spin button
  spinBtn.addEventListener('click', (ev) => {
    if (!audioReady) loadAudio();
    hideResult();
    if (activeChallenges.length === 0) return;
    const choice = activeChallenges[Math.floor(Math.random() * activeChallenges.length)];
    spinToIndex(choice);
  }, { passive: true });

  // again handler (kept for fallback)
  // toNextBtn handler intentionally not set here; wired dynamically in showResult()

  // continue button behavior
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      window.location.href = '../final_message/finish.html';
    });
  }

  // ---------- Init drawing & start ----------
  console.log('Initializing wheel...');
  resizeCanvas();
  console.log('Canvas resized, size:', size);

  window.addEventListener('resize', () => {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    resizeCanvas();
  });

  setTimeout(() => {
    if (falling) initLightSnow(falling, 30);
    spinBtn.disabled = false;
  }, 100);

  // ---------- Debug/Admin Password Modal ----------
  const debugBtn = document.getElementById('debug-btn');
  const passwordModal = document.getElementById('password-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const passwordInput = document.getElementById('password-input');
  const submitPasswordBtn = document.getElementById('submit-password-btn');
  const passwordError = document.getElementById('password-error');

  const DEBUG_PASSWORD = '0000';
  const FINISH_PAGE_URL = '../final_message/finish.html';

  if (debugBtn) {
    debugBtn.addEventListener('click', () => {
      if (passwordModal) { passwordModal.classList.remove('hidden'); passwordModal.setAttribute('aria-hidden','false'); if (passwordInput) passwordInput.focus(); }
    });
  }

  function closeModal() {
    if (!passwordModal) return;
    passwordModal.classList.add('hidden');
    passwordModal.setAttribute('aria-hidden', 'true');
    if (passwordInput) passwordInput.value = '';
    if (passwordError) passwordError.classList.add('hidden');
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (submitPasswordBtn) submitPasswordBtn.addEventListener('click', checkPassword);
  function checkPassword() {
    if (!passwordInput) return;
    const entered = passwordInput.value;
    if (entered === DEBUG_PASSWORD) window.location.href = FINISH_PAGE_URL;
    else { if (passwordError) { passwordError.textContent = 'Incorrect password'; passwordError.classList.remove('hidden'); } passwordInput.value = ''; passwordInput.focus(); }
  }
  if (passwordInput) passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkPassword(); } });
  if (passwordModal) passwordModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

});