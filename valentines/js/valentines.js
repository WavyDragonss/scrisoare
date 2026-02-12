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

const loveMessages = [
  "Muah! You are my forever Valentine.",
  "You + me = cutest love story ever.",
  "Sending you a million kisses and cuddles.",
  "I love you more every single day."
];

const note = document.getElementById("loveNote");
const loveBtn = document.getElementById("loveBtn");
const field = document.getElementById("heartField");

const bgSong = document.getElementById("bgSong");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const reshuffleBtn = document.getElementById("reshuffleBtn");
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

initializePlayer();

loveBtn.addEventListener("click", async () => {
  const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  note.textContent = msg;
  burstHearts(14);

  if (bgSong.paused) {
    await playCurrentTrack();
  }

  openPanelTemporarily();
});

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

reshuffleBtn.addEventListener("click", async () => {
  reshuffleKeepingCurrent();
  await playCurrentTrack();
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

setInterval(() => {
  if (document.visibilityState === "visible") {
    spawnHeart();
  }
}, 1200);

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

function reshuffleKeepingCurrent() {
  const currentId = shuffledOrder[currentOrderIndex];
  const rest = tracks
    .map((track) => track.id)
    .filter((id) => id !== currentId);

  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  shuffledOrder = [currentId, ...rest];
  currentOrderIndex = 0;
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
    note.textContent = "Tap Play again if your browser blocked the first attempt.";
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

function burstHearts(count) {
  for (let i = 0; i < count; i += 1) {
    spawnHeart();
  }
}

function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💖" : "💗";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${3 + Math.random() * 2.5}s`;
  field.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5600);
}
