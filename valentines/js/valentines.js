const TRACK_COUNT = 12;
const RECENT_KEY = "valentines_recent_tracks";
const RECENT_LIMIT = 4;

const tracks = Array.from({ length: TRACK_COUNT }, (_, index) => {
  const id = index + 1;
  return {
    id,
    src: `music/${id}.opus`
  };
});

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

let shuffledOrder = [];
let currentOrderIndex = 0;

initializePlayer();

loveBtn.addEventListener("click", () => {
  const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  note.textContent = msg;
  burstHearts(14);
});

playPauseBtn.addEventListener("click", async () => {
  if (bgSong.paused) {
    await playCurrentTrack();
  } else {
    bgSong.pause();
    updatePlayButton();
  }
});

nextBtn.addEventListener("click", async () => {
  await goToNextTrack();
});

prevBtn.addEventListener("click", async () => {
  await goToPrevTrack();
});

reshuffleBtn.addEventListener("click", async () => {
  reshuffleKeepingCurrent();
  await playCurrentTrack();
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
});

bgSong.addEventListener("ended", async () => {
  await goToNextTrack();
});

bgSong.addEventListener("play", () => updatePlayButton());
bgSong.addEventListener("pause", () => updatePlayButton());

setInterval(() => {
  if (document.visibilityState === "visible") {
    spawnHeart();
  }
}, 1200);

function initializePlayer() {
  shuffledOrder = buildShuffledOrder(getRecentTracks());
  currentOrderIndex = 0;
  setAudioSourceForCurrentTrack();
  updatePlayButton();
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
  nowPlaying.textContent = `Now playing: #${id}`;
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
    return;
  }

  currentOrderIndex -= 1;

  if (currentOrderIndex < 0) {
    currentOrderIndex = shuffledOrder.length - 1;
  }

  setAudioSourceForCurrentTrack();
  await playCurrentTrack();
}

function updatePlayButton() {
  playPauseBtn.textContent = bgSong.paused ? "Play" : "Pause";
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
    return parsed.map(Number).filter((num) => Number.isInteger(num) && num >= 1 && num <= TRACK_COUNT);
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
