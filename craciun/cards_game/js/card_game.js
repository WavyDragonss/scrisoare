(() => {
  // ⛄️🎅🍪🎁🔔🎄🎶🎀🧁✨⭐🧦
  const EMOJI_PAIRS = [
    '🎅','🎄','❄️','⛄','🎁','🔔',
    '🎀','🍪','⭐','🧦','🎶','🧁'
  ];
  const SINGLE = '✨'; // special/bonus
  const FLIP_BACK_DELAY = 900;
  const REMOVE_DELAY = 400;
  const AUTO_REMOVE_FINAL_DELAY = 700;

  const board = document.getElementById('board');
  const surpriseBtn = document.getElementById('surprise-btn');
  const sound = document.getElementById('tada-sound');

  let deck = [], flipped = [], lockBoard = false, activeTimeouts = [];

  function init() {
    clearPendingTimeouts();
    surpriseBtn.style.display = 'none';
    surpriseBtn.setAttribute('aria-hidden', 'true');
    // Build values: 12 pairs x2, + 1 bonus
    const values =
      [...EMOJI_PAIRS, ...EMOJI_PAIRS, SINGLE];
    deck = shuffle(values.slice());
    renderBoard();

    if (!surpriseBtn.dataset.bound) {
      surpriseBtn.addEventListener('click', () => {
        window.location.href = 'bj.html';
      });
      surpriseBtn.dataset.bound = 'true';
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderBoard() {
    board.innerHTML = '';
    deck.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-index', idx);
      card.setAttribute('data-symbol', emoji);
      card.setAttribute('aria-pressed', 'false');
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">?</div>
          <div class="card-face card-back">${emoji}</div>
        </div>
      `;
      card.addEventListener('click', onCardClick);
      card.addEventListener('keydown', onCardKeydown);
      board.appendChild(card);
    });
  }

  function onCardClick(e) { flipCard(e.currentTarget); }
  function onCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(e.currentTarget);
    }
  }

  function flipCard(card) {
    if (lockBoard || !card || card.classList.contains('hidden') || card.classList.contains('flipped')) return;
    if (flipped.length === 1 && flipped[0] === card) return;
    card.classList.add('flipped');
    card.setAttribute('aria-pressed', 'true');
    flipped.push(card);
    if (flipped.length === 2) checkForMatch();
  }

  function checkForMatch() {
    lockBoard = true;
    const [c1, c2] = flipped;
    const val1 = c1.dataset.symbol, val2 = c2.dataset.symbol;
    if (val1 === val2 && val1 !== SINGLE) {
      sound.currentTime = 0;
      sound.volume = 0.23;
      sound.play();
      const t = setTimeout(() => {
        c1.classList.add('hidden');
        c2.classList.add('hidden');
        c1.removeEventListener('click', onCardClick);
        c1.removeEventListener('keydown', onCardKeydown);
        c2.removeEventListener('click', onCardClick);
        c2.removeEventListener('keydown', onCardKeydown);
        flipped = [];
        lockBoard = false;
        checkGameEnd();
      }, REMOVE_DELAY);
      activeTimeouts.push(t);
    } else {
      const t = setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.setAttribute('aria-pressed', 'false');
        c2.setAttribute('aria-pressed', 'false');
        flipped = [];
        lockBoard = false;
      }, FLIP_BACK_DELAY);
      activeTimeouts.push(t);
    }
  }

  function checkGameEnd() {
    const remaining = board.querySelectorAll('.card:not(.hidden)');
    const remainCount = remaining.length;
    if (remainCount === 0) return revealSurpriseButton();
    if (remainCount === 1) {
      const lastCard = remaining[0];
      const t1 = setTimeout(() => { lastCard.classList.add('flipped'); }, 160);
      const t2 = setTimeout(() => {
        lastCard.classList.add('hidden');
        lastCard.removeEventListener('click', onCardClick);
        lastCard.removeEventListener('keydown', onCardKeydown);
        revealSurpriseButton();
      }, AUTO_REMOVE_FINAL_DELAY + 160);
      activeTimeouts.push(t1, t2);
    }
  }

  function revealSurpriseButton() {
    if (surpriseBtn.style.display === 'none' || surpriseBtn.style.display === '') {
      surpriseBtn.style.display = 'inline-block';
      surpriseBtn.setAttribute('aria-hidden', 'false');
      surpriseBtn.focus();
    }
  }

  function clearPendingTimeouts() { activeTimeouts.forEach(id => clearTimeout(id)); activeTimeouts = []; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.__memoryGameRestart = () => { clearPendingTimeouts(); init(); };

  /* ---------------- Debug/Admin Password Modal logic ---------------- */
  const debugBtn = document.getElementById('debug-btn');
  const passwordModal = document.getElementById('password-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const passwordInput = document.getElementById('password-input');
  const submitPasswordBtn = document.getElementById('submit-password-btn');
  const passwordError = document.getElementById('password-error');

  // set your password and finish page here:
  const DEBUG_PASSWORD = '0000';
  const FINISH_PAGE_URL = '../final_message/finish.html';

  if (debugBtn) {
    debugBtn.addEventListener('click', () => {
      if (!passwordModal) return;
      passwordModal.classList.remove('hidden');
      passwordModal.setAttribute('aria-hidden','false');
      if (passwordInput) passwordInput.focus();
    });
  }

  function closeModal() {
    if (!passwordModal) return;
    passwordModal.classList.add('hidden');
    passwordModal.setAttribute('aria-hidden','true');
    if (passwordInput) passwordInput.value = '';
    if (passwordError) passwordError.classList.add('hidden');
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (submitPasswordBtn) submitPasswordBtn.addEventListener('click', checkPassword);
  function checkPassword() {
    if (!passwordInput) return;
    const entered = passwordInput.value;
    if (entered === DEBUG_PASSWORD) {
      // redirect to finish page
      window.location.href = FINISH_PAGE_URL;
    } else {
      if (passwordError) {
        passwordError.textContent = 'Parola incorecta';
        passwordError.classList.remove('hidden');
      }
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
  if (passwordInput) passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkPassword(); } });
  if (passwordModal) passwordModal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

})();
