// bj.js -- Blackjack logic w/ point calculator, win/lose message, help modal, surprise unlock, improved restart logic

let deck = [];
let playerHand = [];
let dealerHand = [];
let wins = 0, losses = 0, draws = 0;
let playerTurn = true;
let gameActive = false;
let roundEnded = false;

const suits = ['♠','♥','♦','♣'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

// --- DOM ---
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnRestart = document.getElementById('btn-restart');
const btnSurprise = document.getElementById('btn-surprise');
const winsSpan = document.getElementById('wins');
const lossesSpan = document.getElementById('losses');
const drawsSpan = document.getElementById('draws');
const dealerPointsLabel = document.getElementById('dealer-points').querySelector('span');
const playerPointsLabel = document.getElementById('player-points').querySelector('span');
const gameMsg = document.getElementById('game-msg');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpClose = document.getElementById('help-close');

let autoRestartTimeout = null;

// --- Helpers ---
function createDeck() {
    let d = [];
    for (const s of suits) for (const r of ranks) d.push({suit: s, rank: r});
    return d;
}
function shuffle(deck) {
    for (let i = deck.length-1; i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
function cardValue(card) {
    if (!card) return 0;
    if (card.rank === 'A') return 11;
    if (['K','Q','J'].includes(card.rank)) return 10;
    return parseInt(card.rank);
}
function handValue(hand) {
    let sum = 0, aces = 0;
    for (const c of hand) {
        sum += cardValue(c);
        if (c.rank === 'A') aces++;
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; }
    return sum;
}
function renderHand(div, hand, hideSecond=false) {
    div.innerHTML = '';
    hand.forEach((c,i) => {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = (hideSecond && i===1) ? '🂠' : `${c.rank}${c.suit}`;
        div.appendChild(cardDiv);
    });
}

// --- Main game functions ---
function startGame() {
    deck = shuffle(createDeck());
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    playerTurn = true;
    gameActive = true;
    roundEnded = false;
    renderHand(playerCardsDiv, playerHand);
    renderHand(dealerCardsDiv, dealerHand, true);
    updatePoints();
    btnHit.disabled = false;
    btnStand.disabled = false;
    btnRestart.disabled = true;
    gameMsg.textContent = '';
    clearAutoRestart();
}

function updatePoints() {
    playerPointsLabel.textContent = handValue(playerHand);
    dealerPointsLabel.textContent = gameActive && playerTurn ? '?' : handValue(dealerHand);
}

function updateScore() {
    winsSpan.textContent = wins;
    lossesSpan.textContent = losses;
    drawsSpan.textContent = draws;
    if (wins >= 3) btnSurprise.style.display = 'block';
    else btnSurprise.style.display = 'none';
}

function showMessage(msg, win) {
    gameMsg.textContent = msg;
    gameMsg.style.color = win === true ? '#0bb46f' : win === false ? '#d4006f' : '#ffd166';
}

function endGame(result) {
    btnHit.disabled = true;
    btnStand.disabled = true;
    gameActive = false;
    roundEnded = true;
    btnRestart.disabled = false;
    renderHand(dealerCardsDiv, dealerHand, false);
    updatePoints();

    let msg = '';
    let win = null;
    if (result === 'win') {
        wins++;
        msg = 'Ai castigat<3';
        win = true;
    } else if (result === 'loss') {
        losses++;
        msg = 'UF AI PIERDUT';
        win = false;
    } else {
        draws++;
        msg = "sunteti egali >:(";
        win = null;
    }
    showMessage(msg, win);
    updateScore();

    // Reset after 3 losses
    if (losses >= 5) {
        setTimeout(() => {
            wins = 0; losses = 0; draws = 0;
            updateScore();
            showMessage("Jocul se va reseta dupa 5 pierderi.", false);
            doRestart();
        }, 1700);
        return;
    }

    // If user doesn't press Restart, auto-restart after 2s
    autoRestartTimeout = setTimeout(() => {
        if (roundEnded) {
            doRestart();
        }
    }, 2000);
}

function doRestart() {
    roundEnded = false;
    btnRestart.disabled = true;
    startGame();
}

function clearAutoRestart() {
    if (autoRestartTimeout) {
        clearTimeout(autoRestartTimeout);
        autoRestartTimeout = null;
    }
}

btnHit.onclick = function() {
    if (!gameActive || !playerTurn) return;
    playerHand.push(deck.pop());
    renderHand(playerCardsDiv, playerHand);
    updatePoints();
    let val = handValue(playerHand);
    if (val > 21) {
        endGame('loss');
    }
};
btnStand.onclick = function() {
    if (!gameActive || !playerTurn) return;
    playerTurn = false;
    // Dealer logic: draw until 17 or more
    while (handValue(dealerHand) < 17) dealerHand.push(deck.pop());
    updatePoints();
    let playerVal = handValue(playerHand);
    let dealerVal = handValue(dealerHand);
    if (dealerVal > 21) endGame('win');
    else if (dealerVal > playerVal) endGame('loss');
    else if (dealerVal < playerVal) endGame('win');
    else endGame('draw');
};
btnRestart.onclick = function() {
    if (!roundEnded) return; // Only allow restart after round ends
    clearAutoRestart();
    doRestart();
};

btnSurprise.onclick = function() {
    window.location.href = 'surpriza.html';
};

window.onload = function() {
    startGame();
    updateScore();
};

// --- Help modal logic ---
helpBtn.onclick = function() {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};
helpClose.onclick = function() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        showMessage("Citeste regulile daca ai nevoie de ajutor!", null);
    }, 280);
};
// Close modal on backdrop click
helpModal.addEventListener('click', function(e){
    if (e.target === helpModal) {
        helpModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            showMessage("Citeste regulile daca ai nevoie de ajutor!", null);
        }, 280);
    }
});