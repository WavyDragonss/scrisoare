const santaContainer = document.getElementById('santa-container');
const messageElement = document.getElementById('festive-message');
const emojiExplosion = document.getElementById('emoji-explosion');

// Editable festive messages!
const festiveMessages = [
    "Merry Christmas and lots of light!",
    "Magical holidays with your loved ones.",
    "A joyful winter season!",
    "Warm days and unforgettable moments!"
];
const FADE_IN = 900, SHOW = 2500, FADE_OUT = 700, SWITCH_DELAY = 350;
let current = 0;

// EMOJI EXPLOSION FUNCTION
function triggerEmojiExplosion() {
    const emojis = ["🎄","✨","🎁","❄️","⛄"];
    const burstCount = 18; // Number of emoji particles
    const burstRadius = Math.min(window.innerWidth, window.innerHeight) / 2.8; // Spread radius
    emojiExplosion.innerHTML = ""; // Clean previous
    for (let i = 0; i < burstCount; i++) {
        const angle = Math.random()*2*Math.PI; // Spread all directions
        const dist = rand(burstRadius*0.3, burstRadius*0.98);
        const emoji = emojis[i % emojis.length];
        const el = document.createElement("span");
        el.className = "emoji-burst";
        el.textContent = emoji;
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.opacity = "1";
        // Animate outward
        setTimeout(() => {
            el.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1.15)`;
            el.style.opacity = "0";
        }, 30);
        emojiExplosion.appendChild(el);
        // Remove after effect
        setTimeout(() => { el.remove(); }, 800);
    }
}

// SANTA + EXPLOSION + MESSAGES SEQUENCE
window.addEventListener('DOMContentLoaded', () => {
    santaContainer.style.left = '-730px';
    santaContainer.classList.remove('hide');
    // Santa enters (1s)
    setTimeout(() => {
        santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
        santaContainer.style.left = '10vw';
        // 2s on screen - at exactly 3s, emoji burst
        setTimeout(() => {
            triggerEmojiExplosion();
            // Santa leaves (1s)
            setTimeout(() => {
                santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
                santaContainer.style.left = (window.innerWidth + 60) + "px";
                // After 1s more, hide Santa and start messages
                setTimeout(() => {
                    santaContainer.classList.add('hide');
                    startMessageSequence();
                }, 1000);
            }, 600); // Emoji effect duration (~0.6s)
        }, 2000);
    }, 120);
});

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
            current = (current + 1) % festiveMessages.length;
            cycleMessages();
        }, FADE_OUT + SWITCH_DELAY);
    }, SHOW);
}
function startMessageSequence() {
    hideMessage();
    setTimeout(cycleMessages, 500);
}
function rand(min, max) { return Math.random() * (max - min) + min; }