const santaContainer = document.getElementById('santa-container');
const messageElement = document.getElementById('festive-message');
const emojiExplosions = document.getElementById('emoji-explosions');
const continueBtn = document.getElementById('continue-btn');
const startOverlay = document.getElementById('start-overlay');

// 1. START SCREEN CONTROL
function startSequence() {
    startOverlay.classList.add('hidden');
    setTimeout(() => startSantaSequence(), 500);
}
startOverlay.addEventListener('click', startSequence);
startOverlay.addEventListener('touchend', startSequence);

// 2. SANTA + EMOJI CLUSTERS + MESSAGES
function startSantaSequence() {
    santaContainer.style.left = '-620px';
    santaContainer.classList.remove('hide');
    // Santa enters (1s)
    setTimeout(() => {
        santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
        santaContainer.style.left = '13vw';
        // 2s on screen. At exactly 3s: emoji clusters
        setTimeout(() => {
            triggerEmojiExplosions();
            // Santa leaves (1s)
            setTimeout(() => {
                santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
                santaContainer.style.left = (window.innerWidth + 40) + "px";
                // After 1s more, hide santa and start messages
                setTimeout(() => {
                    santaContainer.classList.add('hide');
                    startMessageSequence();
                }, 1000);
            }, 800); // Emoji duration 0.8s, slight overlap with exit
        }, 2000);
    }, 120);
}

function triggerEmojiExplosions() {
    emojiExplosions.innerHTML = "";
    // Emoji clusters specification:
    // 1. Near Santa's hat
    triggerCluster(window.innerWidth*0.22, window.innerHeight*0.31, 6, 38);
    // 2. Near sleigh
    triggerCluster(window.innerWidth*0.30, window.innerHeight*0.43, 7, 48);
    // 3. Near reindeer
    triggerCluster(window.innerWidth*0.46, window.innerHeight*0.41, 6, 38);
    // 4. Center of screen (optional)
    triggerCluster(window.innerWidth*0.5, window.innerHeight*0.52, 4, 54);
}
function triggerCluster(cx, cy, count, maxRadius) {
    const emojis = ["🎄","✨","🎁","❄️","⛄"];
    for (let i=0; i<count; i++) {
        const angle = Math.random()*2*Math.PI;
        const dist = rand(maxRadius*0.35, maxRadius);
        const emoji = emojis[i % emojis.length];
        const el = document.createElement("span");
        el.className = "emoji-burst";
        el.textContent = emoji;
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
        setTimeout(() => {
            el.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1.15)`;
            el.style.opacity = "0";
        }, 30);
        emojiExplosions.appendChild(el);
        setTimeout(() => { el.remove(); }, 700);
    }
}

// 3. MESSAGES SEQUENCE + FINAL BUTTON
const festiveMessages = [
    "Craciun fericit iubire...",
    "Sper ca iti va placea la unghii",
    "Si ca totul va fi bine",
    "Va urma un joc dupa care poti deschide cadoul...",
    "Nu este nici body mist, nici lumanare parfumata,",
    "Si e ceva pe care tu deja-l ai si imi pare rau",
    "Dar il luasem deja cand tu l-ai luat",
    "Te rog sa te uiti si la scrisoare,",
    "Nu te mai retin...",
    "MULT NOROC SI TE IUHESC ❤️❤️❤️❤️✨✨✨✨"
];

const FADE_IN = 900, SHOW = 2500, FADE_OUT = 700, SWITCH_DELAY = 350;
let current = 0;

function showMessage(text) {
    messageElement.textContent = text;
    messageElement.classList.add('visible');
    messageElement.classList.remove('hide');
}
function hideMessage() {
    messageElement.classList.remove('visible');
    messageElement.classList.add('hide');
}
function cycleMessages() {
    showMessage(festiveMessages[current]);
    setTimeout(() => {
        hideMessage();
        setTimeout(() => {
            current++;
            if (current < festiveMessages.length) {
                cycleMessages();
            } else {
                showContinueButton();
            }
        }, FADE_OUT + SWITCH_DELAY);
    }, SHOW);
}
function startMessageSequence() {
    current = 0;
    hideMessage();
    setTimeout(cycleMessages, 500);
}
function showContinueButton() {
    continueBtn.classList.remove('hide');
    setTimeout(() => continueBtn.classList.add('visible'), 50);
}
continueBtn.addEventListener('click', () => {
    continueBtn.classList.remove('visible');
    setTimeout(() => continueBtn.classList.add('hide'), 600);
    // Redirect to the card game page:
    window.location.href = "cards_game/card_game.html";
});
function rand(min, max) { return Math.random() * (max - min) + min; }