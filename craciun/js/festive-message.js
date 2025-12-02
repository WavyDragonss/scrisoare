const santaContainer = document.getElementById('santa-container');
const messageElement = document.getElementById('festive-message');

const festiveMessages = [
    "Crăciun fericit și plin de lumină!",
    "Sărbători magice lângă cei dragi.",
    "Un sezon de iarnă plin de bucurie!",
    "Zile calde și momente de neuitat!"
];
const FADE_IN = 880, SHOW = 2450, FADE_OUT = 740, SWITCH_DELAY = 320;
let current = 0;

// Pornim animația Moșului și apoi secvența mesajelor:
function animateSanta() {
    santaContainer.style.left = '-1px';
    santaContainer.classList.remove('hide');
    // Moș Crăciun traversează LENT ecranul
    setTimeout(() => {
        santaContainer.style.left = (window.innerWidth) + 'px';
        setTimeout(() => {
            santaContainer.classList.add('hide');
            startMessageSequence();
        }, 4100 + 400);
    }, 100);
}

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
    setTimeout(cycleMessages, 550);
}

// Automată la încărcare (poate fi customizat cu delay sau trigger)
window.addEventListener('DOMContentLoaded', () => {
    animateSanta();
});