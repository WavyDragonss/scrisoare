// Mobile music player popup for lotus site

const musicTracks = [
  { src: 'music/lotus_ambient.mp3', title: 'I Wanna Be Yours' },
  { src: 'music/preput.mp3', title: 'Preput' },
  { src: 'music/animals.mp3', title: 'Animals' },
  { src: 'music/shut.mp3', title: 'Shut Up And Dance With Me' },
  { src: 'music/cant.mp3', title: "Can't Hold Us" },
  { src: 'music/bones.mp3', title: 'Bones' }
];

// --- DOM Construction ---
const popupBtn = document.createElement('button');
popupBtn.className = 'music-popup-btn';
popupBtn.innerHTML = '𝄞'; // Musical key icon

const popupMenu = document.createElement('div');
popupMenu.className = 'music-popup-menu';
popupMenu.innerHTML = `
  <div class="music-popup-title" id="music-popup-title"></div>
  <div class="music-popup-row">
    <button class="music-popup-btn-control" id="music-popup-prev" title="Previous">&#9198;</button>
    <button class="music-popup-btn-control" id="music-popup-playpause" title="Play/Pause">
      <span id="music-popup-playpause-icon">&#9654;</span>
    </button>
    <button class="music-popup-btn-control" id="music-popup-next" title="Next">&#9197;</button>
  </div>
  <div class="music-popup-row" style="gap:0.4em;">
    <span class="music-popup-time" id="music-popup-current-time">0:00</span>
    <input class="music-popup-progress" id="music-popup-progress" type="range" min="0" max="1000" value="0" step="1">
    <span class="music-popup-time" id="music-popup-duration">0:00</span>
  </div>
  <audio class="music-popup-audio" id="music-popup-audio"></audio>
`;
document.body.appendChild(popupBtn);
document.body.appendChild(popupMenu);

const audio = popupMenu.querySelector('#music-popup-audio');
const title = popupMenu.querySelector('#music-popup-title');
const playpauseBtn = popupMenu.querySelector('#music-popup-playpause');
const playpauseIcon = popupMenu.querySelector('#music-popup-playpause-icon');
const prevBtn = popupMenu.querySelector('#music-popup-prev');
const nextBtn = popupMenu.querySelector('#music-popup-next');
const progressBar = popupMenu.querySelector('#music-popup-progress');
const currentTime = popupMenu.querySelector('#music-popup-current-time');
const duration = popupMenu.querySelector('#music-popup-duration');

let trackIndex = 0;
let isPlaying = false;
let dragging = false;
let lastSeek = 0;

// --- Popup toggle logic ---
popupBtn.addEventListener('click', () => {
  popupMenu.classList.toggle('show');
});

// Click outside closes menu
document.addEventListener('click', function(e) {
  if (
    popupMenu.classList.contains('show') &&
    !popupMenu.contains(e.target) &&
    e.target !== popupBtn
  ) {
    popupMenu.classList.remove('show');
  }
});

// --- Track Controls ---
function setTrack(idx, autoplay = false) {
  trackIndex = idx;
  const track = musicTracks[idx];
  audio.src = track.src;
  title.textContent = track.title;
  progressBar.value = 0;
  progressBar.disabled = true;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  if (autoplay) {
    audio.play();
    isPlaying = true;
    playpauseIcon.innerHTML = "&#10073;&#10073;"; // pause
  } else {
    audio.pause();
    isPlaying = false;
    playpauseIcon.innerHTML = "&#9654;"; // play
  }
}

prevBtn.addEventListener('click', () => {
  setTrack((trackIndex - 1 + musicTracks.length) % musicTracks.length, isPlaying);
});
nextBtn.addEventListener('click', () => {
  setTrack((trackIndex + 1) % musicTracks.length, isPlaying);
});
playpauseBtn.addEventListener('click', () => {
  if (audio.paused) audio.play();
  else audio.pause();
});
audio.addEventListener('play', () => {
  isPlaying = true;
  playpauseIcon.innerHTML = "&#10073;&#10073;";
});
audio.addEventListener('pause', () => {
  isPlaying = false;
  playpauseIcon.innerHTML = "&#9654;";
});
audio.addEventListener('ended', () => {
  setTrack((trackIndex + 1) % musicTracks.length, true);
});

// --- Progress Bar Logic ---
audio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(audio.duration);
  currentTime.textContent = formatTime(audio.currentTime);
  progressBar.disabled = false;
  progressBar.value = audio.duration ? Math.round((audio.currentTime / audio.duration) * 1000) : 0;
});
audio.addEventListener('timeupdate', () => {
  if (!dragging && audio.duration) {
    progressBar.value = Math.round((audio.currentTime / audio.duration) * 1000);
    currentTime.textContent = formatTime(audio.currentTime);
  }
});
progressBar.addEventListener('input', () => {
  if (audio.duration) {
    dragging = true;
    const seekTo = (progressBar.value / 1000) * audio.duration;
    currentTime.textContent = formatTime(seekTo);
    lastSeek = seekTo;
  }
});
['mousedown', 'touchstart'].forEach(evt =>
  progressBar.addEventListener(evt, () => dragging = true)
);
['mouseup', 'touchend', 'change'].forEach(evt =>
  progressBar.addEventListener(evt, () => {
    if (audio.duration && dragging) {
      audio.currentTime = lastSeek;
      currentTime.textContent = formatTime(audio.currentTime);
    }
    dragging = false;
  })
);

function formatTime(time) {
  time = Math.floor(time || 0);
  const m = Math.floor(time / 60);
  const s = time % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

setTrack(0);