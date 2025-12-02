let SCREEN_W = window.innerWidth;
let SCREEN_H = window.innerHeight;
const FALLING_CONTAINER = document.getElementById('falling-elements');
const NUM_SNOWFLAKES = 36;
let snowflakes = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

function createSnowflake() {
    const flake = document.createElement('span');
    flake.className = 'snowflake';
    flake.textContent = '❄';
    // Use latest SCREEN_W/SCREEN_H
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
    snowflakes.push(flake);
}

function spawnSnowflakes() {
    // Remove existing snowflakes
    snowflakes.forEach(flake => flake.remove());
    snowflakes = [];
    // Spawn new snowflakes with updated dimensions
    for (let i = 0; i < NUM_SNOWFLAKES; i++) createSnowflake();
}

// Always run at load:
window.addEventListener('DOMContentLoaded', spawnSnowflakes);

// AND recalculate every time the viewport changes:
window.addEventListener('resize', () => {
    SCREEN_W = window.innerWidth;
    SCREEN_H = window.innerHeight;
    FALLING_CONTAINER.style.width = SCREEN_W + 'px';
    FALLING_CONTAINER.style.height = SCREEN_H + 'px';
    spawnSnowflakes();
});
