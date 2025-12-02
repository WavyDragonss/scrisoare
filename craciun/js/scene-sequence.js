const santaContainer = document.getElementById('santa-container');
const hohoAudio = document.getElementById('hoho-audio');
const messageElement = document.getElementById('festive-message');

// Easily extend or customize this list
const festiveMessages = [
    "Merry Christmas and lots of light!",
    "Magical holidays with your loved ones.",
    "A joyful winter season!",
    "Warm days and unforgettable moments!"
];
const FADE_IN = 900, SHOW = 2500, FADE_OUT = 700, SWITCH_DELAY = 350;
let current = 0;

window.addEventListener('DOMContentLoaded', () => {
    // Santa starts offscreen and is made visible at load
    santaContainer.style.left = '-730px';
    santaContainer.classList.remove('hide');

    // Sequence: Santa enters from left in 1s
    setTimeout(() => {
        santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
        santaContainer.style.left = '10vw'; // Fully visible onscreen

        // At second 1: Play hoho.mp3 (2 seconds)
        setTimeout(() => {
            hohoAudio.currentTime = 0;
            hohoAudio.play();

            // At second 3: Santa leaves to the right slowly (1s)
            setTimeout(() => {
                santaContainer.style.transition = 'left 1000ms cubic-bezier(.56,.05,.65,.88)';
                santaContainer.style.left = (window.innerWidth + 60) + "px";
                // After second 4: Hide Santa and start messages
                setTimeout(() => {
                    santaContainer.classList.add('hide');
                    startMessageSequence();
                }, 1000); // 1s leave time
            }, 2000); // 2s hoho duration
        }, 1000); // 1s onscreen before audio
    }, 120); // slight initial delay for visual smoothness
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