// js/memory.js
// Memory game logic for the 5x5 GUI (board element id="board", button id="surprise-btn")

(() => {
  // Config
  const PAIRS = 12;              // number of distinct pairs (12 pairs = 24 tiles)
  const EXTRA_SINGLE = '★';      // the extra single tile to reach 25
  const FLIP_BACK_DELAY = 900;   // ms before flipping back non-matching cards
  const REMOVE_DELAY = 400;      // ms before removing matched cards (gives time for flip animation)
  const AUTO_REMOVE_FINAL_DELAY = 700; // ms to reveal then remove the final single card
  // Elements
  const board = document.getElementById('board');
  const surpriseBtn = document.getElementById('surprise-btn');

  // State
  let deck = [];                 // shuffled array of tile values (length 25)
  let flipped = [];              // currently flipped cards (max 2 at a time)
  let lockBoard = false;         // prevents clicks while checking
  let activeTimeouts = [];       // store timeouts so they can be cleared if necessary

  // Initialize game on load
  function init() {
    clearPendingTimeouts();
    surpriseBtn.style.display = 'none';
    surpriseBtn.setAttribute('aria-hidden', 'true');

    // build values: pairs 1..PAIRS twice, plus one extra single symbol
    const values = [];
    for (let i = 1; i <= PAIRS; i++) {
      values.push(String(i), String(i));
    }
    values.push(String(EXTRA_SINGLE)); // single to make 25

    // shuffle and store as deck
    deck = shuffle(values.slice());

    // render cards
    renderBoard();

    // attach surprise button behaviour (if not already)
    if (!surpriseBtn.dataset.bound) {
      surpriseBtn.addEventListener('click', () => {
        window.location.href = 'surpriza.html';
      });
      surpriseBtn.dataset.bound = 'true';
    }
  }

  // Fisher-Yates shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create DOM cards inside #board
  function renderBoard() {
    board.innerHTML = '';
    deck.forEach((value, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-index', index);
      card.setAttribute('data-number', value);
      card.setAttribute('aria-pressed', 'false');

      // inner structure matches CSS flip expectations
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">?</div>
          <div class="card-face card-back"><span class="num">${value}</span></div>
        </div>
      `;

      // event handlers
      card.addEventListener('click', onCardClick);
      card.addEventListener('keydown', onCardKeydown);

      board.appendChild(card);
    });
  }

  // Click handler
  function onCardClick(e) {
    flipCard(e.currentTarget);
  }

  // Keyboard support (Enter or Space)
  function onCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flipCard(e.currentTarget);
    }
  }

  // Flip a card (main entry)
  function flipCard(card) {
    if (lockBoard) return;                       // ignore clicks while locked
    if (!card || card.classList.contains('hidden')) return;
    if (card.classList.contains('flipped')) return;

    // Prevent selecting the same card twice as both flipped cards
    if (flipped.length === 1 && flipped[0] === card) return;

    // Flip visually
    card.classList.add('flipped');
    card.setAttribute('aria-pressed', 'true');
    flipped.push(card);

    if (flipped.length === 2) {
      // We have two cards -> check match
      checkForMatch();
    }
  }

  // Check the two flipped cards
  function checkForMatch() {
    lockBoard = true;
    const [c1, c2] = flipped;
    const val1 = c1.dataset.number;
    const val2 = c2.dataset.number;

    // If numbers match -> remove both
    if (val1 === val2) {
      const t = setTimeout(() => {
        // visual removal (CSS handles fade via .hidden)
        c1.classList.add('hidden');
        c2.classList.add('hidden');

        // accessibility / remove interactive ability
        c1.removeEventListener('click', onCardClick);
        c1.removeEventListener('keydown', onCardKeydown);
        c2.removeEventListener('click', onCardClick);
        c2.removeEventListener('keydown', onCardKeydown);

        // cleanup
        flipped = [];
        lockBoard = false;

        // Check if game ended
        checkGameEnd();
      }, REMOVE_DELAY);

      activeTimeouts.push(t);
    } else {
      // Not a match -> flip back after a short delay
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

  // Check if all cards removed or only 1 remains (special handling for 5x5)
  function checkGameEnd() {
    const remaining = board.querySelectorAll('.card:not(.hidden)');
    const remainCount = remaining.length;

    if (remainCount === 0) {
      revealSurpriseButton();
      return;
    }

    // Special: if exactly 1 remains (due to odd count), auto-reveal and remove it then finish
    if (remainCount === 1) {
      const lastCard = remaining[0];

      // Reveal the last card briefly then remove it automatically
      const t1 = setTimeout(() => {
        lastCard.classList.add('flipped');
      }, 160);

      const t2 = setTimeout(() => {
        lastCard.classList.add('hidden');
        lastCard.removeEventListener('click', onCardClick);
        lastCard.removeEventListener('keydown', onCardKeydown);
        revealSurpriseButton();
      }, AUTO_REMOVE_FINAL_DELAY + 160);

      activeTimeouts.push(t1, t2);
    }
  }

  // Show the surprise button
  function revealSurpriseButton() {
    if (surpriseBtn.style.display === 'none' || surpriseBtn.style.display === '') {
      surpriseBtn.style.display = 'inline-block';
      surpriseBtn.setAttribute('aria-hidden', 'false');
      // focus so the user sees it on mobile
      surpriseBtn.focus();
      // optionally, you can auto-redirect here after a short delay:
      // setTimeout(() => { window.location.href = 'surpriza.html'; }, 5000);
    }
  }

  // Clear timeouts (useful if re-initializing)
  function clearPendingTimeouts() {
    activeTimeouts.forEach(id => clearTimeout(id));
    activeTimeouts = [];
  }

  // Run when the DOM is ready (init is idempotent)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Optional: expose a global restart function for debugging
  window.__memoryGameRestart = () => {
    clearPendingTimeouts();
    init();
  };
})();   