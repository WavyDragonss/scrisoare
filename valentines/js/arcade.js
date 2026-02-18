// Music player configuration (reused from valentines.js)
const RECENT_KEY = "valentines_recent_tracks";
const RECENT_LIMIT = 4;
const PLAYER_HIDE_MS = 7000;

const tracks = [
  { id: 1, title: "Delia feat. Uddi - Ipotecat", src: "music/1.opus" },
  { id: 2, title: "Andra - Avioane de hartie", src: "music/2.opus" },
  { id: 3, title: "Oana Radu & Dr. Mako feat. Eli - Tu", src: "music/3.opus" },
  { id: 4, title: "Randi - Visator", src: "music/4.opus" },
  { id: 5, title: "Delia feat. Speak - A lu' Mamaia", src: "music/5.opus" },
  { id: 6, title: "Puya si Don Baxter - Baga Bani", src: "music/6.opus" },
  { id: 7, title: "Andra - Niciodata Sa Nu Spui Niciodata", src: "music/7.opus" },
  { id: 8, title: "Mihail - Ma ucide ea", src: "music/8.opus" },
  { id: 9, title: "Elena feat. Glance - Mamma mia (He's italiano)", src: "music/9.opus" },
  { id: 10, title: "Andra - Inevitabil va fi bine", src: "music/10.opus" },
  { id: 11, title: "Carla's Dreams feat. Delia - Cum ne noi", src: "music/11.opus" }
];

const validTrackIds = new Set(tracks.map((track) => track.id));

// DOM Elements
const gameArea = document.getElementById("gameArea");
const backBtn = document.getElementById("backBtn");
const gameButtons = document.querySelectorAll(".game-btn");

const bgSong = document.getElementById("bgSong");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackSelect = document.getElementById("trackSelect");
const nowPlaying = document.getElementById("nowPlaying");
const progressBar = document.getElementById("progressBar");
const timeInfo = document.getElementById("timeInfo");

const playerToggle = document.getElementById("playerToggle");
const panelCloseBtn = document.getElementById("panelCloseBtn");
const musicPanel = document.getElementById("musicPanel");

let shuffledOrder = [];
let currentOrderIndex = 0;
let hideTimer = null;
let currentGame = null;

// Initialize
initializePlayer();
setupGameButtons();

function setupGameButtons() {
  gameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const game = btn.dataset.game;
      startGame(game);
    });
  });

  backBtn.addEventListener("click", () => {
    endGame();
  });
}

function startGame(gameName) {
  currentGame = gameName;
  gameArea.innerHTML = "";
  gameArea.style.display = "block";
  backBtn.style.display = "block";

  document.querySelector(".games-grid").style.display = "none";
  document.querySelector(".header").style.display = "none";

  switch (gameName) {
    case "flappyKitty":
      initFlappyKitty();
      break;
    case "memoryMatch":
      initMemoryMatch();
      break;
    case "heartCollector":
      initHeartCollector();
      break;
    case "balloonPop":
      initBalloonPop();
      break;
    case "colorMatch":
      initColorMatch();
      break;
    case "speedClicker":
      initSpeedClicker();
      break;
  }
}

function endGame() {
  currentGame = null;
  gameArea.innerHTML = "";
  gameArea.style.display = "none";
  backBtn.style.display = "none";

  document.querySelector(".games-grid").style.display = "grid";
  document.querySelector(".header").style.display = "block";
}

// ===== GAME: Flappy Kitty =====
function initFlappyKitty() {
  const width = gameArea.clientWidth;
  const height = gameArea.clientHeight;

  const html = `
    <div style="position: relative; width: 100%; height: 100%; background: rgba(255, 240, 245, 0.5); overflow: hidden;">
      <div id="kitty" style="position: absolute; left: 50px; top: 50%; width: 40px; height: 40px; font-size: 30px; line-height: 40px; transform: translateY(-50%); z-index: 10;">🐱</div>
      <div id="scoreDisplay" style="position: absolute; top: 10px; left: 10px; font-weight: bold; font-size: 18px; color: #e42b63; z-index: 20;">Score: 0</div>
      <p style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: #c42f66; font-weight: bold;">Click or tap to flap!</p>
    </div>
  `;

  gameArea.innerHTML = html;

  const kitty = document.getElementById("kitty");
  const scoreDisplay = document.getElementById("scoreDisplay");

  let kittyY = height / 2;
  let kittyVelocity = 0;
  const gravity = 0.5;
  const flap = -12;
  let score = 0;
  let gameRunning = true;
  let pipes = [];
  let pipeId = 0;

  function update() {
    if (!gameRunning) return;

    kittyVelocity += gravity;
    kittyY += kittyVelocity;

    kitty.style.top = kittyY + "px";

    if (kittyY + 40 > height || kittyY < 0) {
      gameRunning = false;
      setTimeout(() => {
        alert(`Game Over! Score: ${score}`);
        endGame();
      }, 100);
      return;
    }

    pipes.forEach((pipe, index) => {
      pipe.x -= 5;

      const pipeElement = document.getElementById(`pipe-${pipe.id}`);
      if (pipeElement) {
        pipeElement.style.left = pipe.x + "px";
      }

      if (pipe.x + 60 < 0) {
        pipeElement.remove();
        pipes.splice(index, 1);
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
      }

      if (
        50 < pipe.x + 60 &&
        50 + 40 > pipe.x &&
        (kittyY < pipe.gap || kittyY + 40 > pipe.gap + 120)
      ) {
        gameRunning = false;
        setTimeout(() => {
          alert(`Game Over! Score: ${score}`);
          endGame();
        }, 100);
      }
    });

    requestAnimationFrame(update);
  }

  function createPipe() {
    if (!gameRunning) return;

    const gapStart = Math.random() * (height - 200);
    const pipe = {
      id: pipeId++,
      x: width,
      gap: gapStart
    };

    pipes.push(pipe);

    const pipeHTML = `
      <div id="pipe-${pipe.id}" style="position: absolute; top: 0; width: 60px; height: 100%; pointer-events: none;">
        <div style="width: 100%; height: ${gapStart}px; background: #ff5f99; border-left: 2px solid #ff3d6e; border-right: 2px solid #ff3d6e;"></div>
        <div style="width: 100%; height: ${height - gapStart - 120}px; background: #ff5f99; border-left: 2px solid #ff3d6e; border-right: 2px solid #ff3d6e; margin-top: 120px;"></div>
      </div>
    `;

    gameArea.insertAdjacentHTML("beforeend", pipeHTML);
  }

  document.addEventListener(
    "click",
    function flap() {
      if (gameRunning) {
        kittyVelocity = flap;
      }
    },
    { once: true }
  );

  gameArea.addEventListener("click", () => {
    if (gameRunning) {
      kittyVelocity = flap;
    }
  });

  setInterval(createPipe, 2500);
  update();
}

// ===== GAME: Memory Match =====
function initMemoryMatch() {
  const cards = [
    "🐱", "🎀", "💗", "🌸",
    "🐱", "🎀", "💗", "🌸"
  ];

  let shuffledCards = cards.sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = 0;

  const html = `
    <div style="padding: 20px;">
      <div id="scoreDisplay" style="text-align: center; font-weight: bold; font-size: 18px; color: #e42b63; margin-bottom: 20px;">Matched: 0/4</div>
      <div id="cardGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 300px; margin: 0 auto;"></div>
    </div>
  `;

  gameArea.innerHTML = html;
  const cardGrid = document.getElementById("cardGrid");
  const scoreDisplay = document.getElementById("scoreDisplay");

  shuffledCards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.style.cssText = `
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #ff9dc2, #ff7bab);
      border: 2px solid #ff5f99;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 10px rgba(255, 61, 110, 0.2);
    `;
    cardEl.textContent = "?";
    cardEl.dataset.card = card;
    cardEl.dataset.index = index;
    cardEl.dataset.flipped = "false";

    cardEl.addEventListener("click", () => {
      if (cardEl.dataset.flipped === "true" || flipped.length >= 2) return;

      cardEl.textContent = card;
      cardEl.dataset.flipped = "true";
      flipped.push({ el: cardEl, card });

      if (flipped.length === 2) {
        setTimeout(() => {
          if (flipped[0].card === flipped[1].card) {
            flipped[0].el.style.opacity = "0.5";
            flipped[1].el.style.opacity = "0.5";
            matched += 1;
            scoreDisplay.textContent = `Matched: ${matched}/4`;

            if (matched === 4) {
              setTimeout(() => {
                alert("You won! 🎉");
                endGame();
              }, 500);
            }
          } else {
            flipped[0].el.textContent = "?";
            flipped[1].el.textContent = "?";
            flipped[0].el.dataset.flipped = "false";
            flipped[1].el.dataset.flipped = "false";
          }
          flipped = [];
        }, 800);
      }
    });

    cardGrid.appendChild(cardEl);
  });
}

// ===== GAME: Heart Collector =====
function initHeartCollector() {
  const width = gameArea.clientWidth;
  const height = gameArea.clientHeight;

  gameArea.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; background: rgba(255, 240, 245, 0.5);">
      <div id="player" style="position: absolute; bottom: 20px; left: 50%; width: 50px; height: 50px; font-size: 40px; line-height: 50px; text-align: center; transform: translateX(-50%); z-index: 10;">🐱</div>
      <div id="scoreDisplay" style="position: absolute; top: 10px; left: 10px; font-weight: bold; font-size: 18px; color: #e42b63; z-index: 20;">Hearts: 0</div>
      <p style="position: absolute; bottom: 20px; right: 20px; color: #c42f66; font-weight: bold; font-size: 14px;">Use Arrow Keys or Mouse</p>
    </div>
  `;

  const player = document.getElementById("player");
  const scoreDisplay = document.getElementById("scoreDisplay");

  let playerX = width / 2 - 25;
  let score = 0;
  let hearts = [];
  let heartId = 0;
  let gameRunning = true;

  function movePlayer(x) {
    playerX = Math.max(0, Math.min(width - 50, x));
    player.style.left = playerX + 25 + "px";
  }

  document.addEventListener("mousemove", (e) => {
    const rect = gameArea.getBoundingClientRect();
    movePlayer(e.clientX - rect.left - 25);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") movePlayer(playerX - 20);
    if (e.key === "ArrowRight") movePlayer(playerX + 20);
  });

  function spawnHeart() {
    if (!gameRunning) return;

    const heart = document.createElement("div");
    const x = Math.random() * (width - 40);
    const h = {
      id: heartId++,
      x: x,
      y: 0,
      el: heart
    };

    heart.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: 0;
      width: 40px;
      height: 40px;
      font-size: 30px;
      line-height: 40px;
      text-align: center;
      z-index: 5;
    `;
    heart.textContent = "💗";

    gameArea.appendChild(heart);
    hearts.push(h);
  }

  function update() {
    if (!gameRunning) return;

    hearts.forEach((heart, index) => {
      heart.y += 3;
      heart.el.style.top = heart.y + "px";

      if (
        heart.y + 40 > height - 50 &&
        heart.x > playerX &&
        heart.x < playerX + 50
      ) {
        heart.el.remove();
        hearts.splice(index, 1);
        score += 1;
        scoreDisplay.textContent = `Hearts: ${score}`;
      } else if (heart.y > height) {
        heart.el.remove();
        hearts.splice(index, 1);
      }
    });

    requestAnimationFrame(update);
  }

  setInterval(spawnHeart, 800);
  update();
}

// ===== GAME: Balloon Pop =====
function initBalloonPop() {
  const width = gameArea.clientWidth;
  const height = gameArea.clientHeight;

  gameArea.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; background: rgba(255, 240, 245, 0.5);">
      <div id="scoreDisplay" style="position: absolute; top: 10px; left: 10px; font-weight: bold; font-size: 18px; color: #e42b63; z-index: 20;">Popped: 0</div>
      <p style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: #c42f66; font-weight: bold;">Click balloons to pop them!</p>
    </div>
  `;

  const scoreDisplay = document.getElementById("scoreDisplay");
  let score = 0;

  function spawnBalloon() {
    const balloon = document.createElement("div");
    const x = Math.random() * (width - 60);
    const y = Math.random() * (height - 100);

    balloon.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff9dc2, #ff7bab);
      border: 2px solid #ff5f99;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.1s ease;
      z-index: 5;
    `;
    balloon.textContent = "🎈";

    balloon.addEventListener("click", (e) => {
      e.stopPropagation();
      balloon.style.transform = "scale(0)";
      score += 1;
      scoreDisplay.textContent = `Popped: ${score}`;
      setTimeout(() => balloon.remove(), 100);
    });

    gameArea.appendChild(balloon);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (balloon.parentElement) balloon.remove();
    }, 5000);
  }

  setInterval(spawnBalloon, 1200);
  for (let i = 0; i < 3; i++) {
    setTimeout(spawnBalloon, i * 400);
  }
}

// ===== GAME: Color Match =====
function initColorMatch() {
  const colors = [
    { name: "pink", hex: "#ff9dc2" },
    { name: "red", hex: "#ff3d6e" },
    { name: "light pink", hex: "#ffd8e8" }
  ];

  let score = 0;
  let currentRound = 0;

  const html = `
    <div style="padding: 40px 20px; text-align: center;">
      <div id="scoreDisplay" style="font-weight: bold; font-size: 18px; color: #e42b63; margin-bottom: 30px;">Score: 0</div>
      <div id="colorTarget" style="width: 120px; height: 120px; border-radius: 12px; margin: 0 auto 30px; border: 3px solid #ff5f99; box-shadow: 0 6px 20px rgba(255, 61, 110, 0.2);"></div>
      <div id="buttons" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"></div>
    </div>
  `;

  gameArea.innerHTML = html;
  const colorTarget = document.getElementById("colorTarget");
  const buttonsContainer = document.getElementById("buttons");
  const scoreDisplay = document.getElementById("scoreDisplay");

  function newRound() {
    currentRound += 1;
    const target = colors[Math.floor(Math.random() * colors.length)];
    colorTarget.style.backgroundColor = target.hex;
    colorTarget.dataset.target = target.name;

    buttonsContainer.innerHTML = "";

    const shuffled = [...colors].sort(() => Math.random() - 0.5);

    shuffled.forEach((color) => {
      const btn = document.createElement("button");
      btn.style.cssText = `
        width: 100px;
        height: 100px;
        border-radius: 12px;
        border: 2px solid #ff5f99;
        background: ${color.hex};
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        color: white;
        transition: all 0.2s ease;
        box-shadow: 0 4px 10px rgba(255, 61, 110, 0.2);
      `;
      btn.textContent = color.name;

      btn.addEventListener("click", () => {
        if (color.name === target.name) {
          score += 1;
          scoreDisplay.textContent = `Score: ${score}`;
          newRound();
        } else {
          setTimeout(() => {
            alert(`Wrong! The correct color was ${target.name}. Final Score: ${score}`);
            endGame();
          }, 200);
        }
      });

      buttonsContainer.appendChild(btn);
    });
  }

  newRound();
}

// ===== GAME: Speed Clicker =====
function initSpeedClicker() {
  let clicks = 0;
  let timeLeft = 10;

  const html = `
    <div style="padding: 40px 20px; text-align: center;">
      <div id="timerDisplay" style="font-weight: bold; font-size: 48px; color: #e42b63; margin-bottom: 20px;">10</div>
      <div id="clicksDisplay" style="font-weight: bold; font-size: 24px; color: #c42f66; margin-bottom: 40px;">Clicks: 0</div>
      <button id="clickBtn" style="width: 200px; height: 200px; border-radius: 50%; border: 3px solid #ff5f99; background: linear-gradient(135deg, #ff9dc2, #ff7bab); font-size: 80px; cursor: pointer; transition: all 0.05s ease; box-shadow: 0 8px 20px rgba(255, 61, 110, 0.3);">💖</button>
    </div>
  `;

  gameArea.innerHTML = html;

  const timerDisplay = document.getElementById("timerDisplay");
  const clicksDisplay = document.getElementById("clicksDisplay");
  const clickBtn = document.getElementById("clickBtn");

  clickBtn.addEventListener("click", () => {
    if (timeLeft > 0) {
      clicks += 1;
      clicksDisplay.textContent = `Clicks: ${clicks}`;
      clickBtn.style.transform = "scale(0.95)";
      setTimeout(() => {
        clickBtn.style.transform = "scale(1)";
      }, 50);
    }
  });

  const timer = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      clickBtn.disabled = true;
      setTimeout(() => {
        alert(`Time's up! You got ${clicks} clicks! 🎉`);
        endGame();
      }, 300);
    }
  }, 1000);
}

// ===== Music Player Functions =====
function initializePlayer() {
  populateTrackSelect();
  shuffledOrder = buildShuffledOrder(getRecentTracks());
  currentOrderIndex = 0;
  setAudioSourceForCurrentTrack();
  updatePlayButton();
  updateProgressUi();
}

function populateTrackSelect() {
  trackSelect.innerHTML = "";

  tracks.forEach((track) => {
    const option = document.createElement("option");
    option.value = String(track.id);
    option.textContent = `${track.id}. ${track.title}`;
    trackSelect.appendChild(option);
  });
}

function buildShuffledOrder(avoidList) {
  const ids = tracks.map((track) => track.id);

  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  if (avoidList.length > 0 && avoidList.includes(ids[0])) {
    const swapIndex = ids.findIndex((id) => !avoidList.includes(id));
    if (swapIndex > 0) {
      [ids[0], ids[swapIndex]] = [ids[swapIndex], ids[0]];
    }
  }

  return ids;
}

function setAudioSourceForCurrentTrack() {
  const id = shuffledOrder[currentOrderIndex];
  const selectedTrack = tracks.find((track) => track.id === id);

  if (!selectedTrack) {
    return;
  }

  bgSong.src = selectedTrack.src;
  trackSelect.value = String(id);
  nowPlaying.textContent = `Now playing: ${selectedTrack.id}. ${selectedTrack.title}`;
  progressBar.value = "0";
  timeInfo.textContent = "00:00 / 00:00 (left 00:00)";
  pushRecentTrack(id);
}

async function playCurrentTrack() {
  try {
    await bgSong.play();
    updatePlayButton();
  } catch {
    console.log("Audio playback blocked");
  }
}

async function goToNextTrack() {
  currentOrderIndex += 1;

  if (currentOrderIndex >= shuffledOrder.length) {
    const recent = getRecentTracks();
    shuffledOrder = buildShuffledOrder(recent);
    currentOrderIndex = 0;
  }

  setAudioSourceForCurrentTrack();
  await playCurrentTrack();
}

async function goToPrevTrack() {
  if (bgSong.currentTime > 3) {
    bgSong.currentTime = 0;
    updateProgressUi();
    return;
  }

  currentOrderIndex -= 1;

  if (currentOrderIndex < 0) {
    currentOrderIndex = shuffledOrder.length - 1;
  }

  setAudioSourceForCurrentTrack();
  await playCurrentTrack();
}

function updateProgressUi() {
  const current = Number.isFinite(bgSong.currentTime) ? bgSong.currentTime : 0;
  const duration = Number.isFinite(bgSong.duration) ? bgSong.duration : 0;

  if (duration > 0) {
    progressBar.value = String(Math.round((current / duration) * 1000));
  } else {
    progressBar.value = "0";
  }

  const left = Math.max(0, duration - current);
  timeInfo.textContent = `${formatTime(current)} / ${formatTime(duration)} (left ${formatTime(left)})`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function updatePlayButton() {
  playPauseBtn.textContent = bgSong.paused ? "Play" : "Pause";
}

function openPanelTemporarily() {
  musicPanel.classList.remove("is-collapsed");
  playerToggle.setAttribute("aria-expanded", "true");
  bumpPanelTimer();
}

function collapsePanel() {
  musicPanel.classList.add("is-collapsed");
  playerToggle.setAttribute("aria-expanded", "false");
  clearTimeout(hideTimer);
  hideTimer = null;
}

function bumpPanelTimer() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    collapsePanel();
  }, PLAYER_HIDE_MS);
}

function pushRecentTrack(id) {
  const unique = getRecentTracks().filter((trackId) => trackId !== id);
  unique.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(unique.slice(0, RECENT_LIMIT)));
}

function getRecentTracks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(Number)
      .filter((num) => Number.isInteger(num) && validTrackIds.has(num));
  } catch {
    return [];
  }
}

// Event Listeners for Music Player
playPauseBtn.addEventListener("click", async () => {
  if (bgSong.paused) {
    await playCurrentTrack();
  } else {
    bgSong.pause();
    updatePlayButton();
  }
  bumpPanelTimer();
});

nextBtn.addEventListener("click", async () => {
  await goToNextTrack();
  bumpPanelTimer();
});

prevBtn.addEventListener("click", async () => {
  await goToPrevTrack();
  bumpPanelTimer();
});

trackSelect.addEventListener("change", async (event) => {
  const pickedId = Number(event.target.value);
  const foundIndex = shuffledOrder.indexOf(pickedId);

  if (foundIndex === -1) {
    return;
  }

  currentOrderIndex = foundIndex;
  setAudioSourceForCurrentTrack();
  await playCurrentTrack();
  bumpPanelTimer();
});

bgSong.addEventListener("ended", async () => {
  await goToNextTrack();
});

bgSong.addEventListener("play", () => {
  updatePlayButton();
  bumpPanelTimer();
});

bgSong.addEventListener("pause", () => {
  updatePlayButton();
});

bgSong.addEventListener("timeupdate", () => {
  updateProgressUi();
});

bgSong.addEventListener("loadedmetadata", () => {
  updateProgressUi();
});

progressBar.addEventListener("input", () => {
  const duration = Number.isFinite(bgSong.duration) ? bgSong.duration : 0;
  if (duration <= 0) {
    return;
  }

  const target = (Number(progressBar.value) / 1000) * duration;
  bgSong.currentTime = target;
  updateProgressUi();
  bumpPanelTimer();
});

playerToggle.addEventListener("click", () => {
  if (musicPanel.classList.contains("is-collapsed")) {
    openPanelTemporarily();
  } else {
    collapsePanel();
  }
});

panelCloseBtn.addEventListener("click", () => {
  collapsePanel();
});

["pointerdown", "input", "change", "mousemove", "touchstart"].forEach((eventName) => {
  musicPanel.addEventListener(eventName, () => bumpPanelTimer(), { passive: true });
});