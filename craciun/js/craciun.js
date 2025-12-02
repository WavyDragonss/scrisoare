// Falling snowflakes, always active
const NUM_SNOWFLAKES = 36;
const FALLING_CONTAINER = document.getElementById('falling-elements');
const SCREEN_W = window.innerWidth;
const SCREEN_H = window.innerHeight;
function rand(min, max) { return Math.random() * (max - min) + min; }
function createSnowflake() {
    const flake = document.createElement('span');
    flake.className = 'snowflake';
    flake.textContent = '❄';
    flake.style.left = rand(0, SCREEN_W - 30) + 'px';
    flake.style.fontSize = rand(18, 48) + 'px';
    flake.style.opacity = rand(0.5, 0.85);
    let top = -rand(20, 120);
    let speed = rand(0.6, 2.2);
    let x = parseFloat(flake.style.left);
    let drift = rand(-1, 1);
    function animate() {
        top += speed;
        x += Math.sin(top/25) * drift;
        flake.style.top = top + 'px';
        flake.style.left = x + 'px';
        if (top > SCREEN_H + 10) {
            top = -rand(30, 120);
            x = rand(0, SCREEN_W - 30);
        }
        requestAnimationFrame(animate);
    }
    animate();
    FALLING_CONTAINER.appendChild(flake);
}
window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < NUM_SNOWFLAKES; i++) createSnowflake();
});