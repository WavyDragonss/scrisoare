// music2.js - floating music player bubble for lotus site

const music2_tracks = [
  { src: 'music/lotus_ambient.mp3', title: 'I Wanna Be Yours' },
  { src: 'music/preput.mp3', title: 'Preput' },
  { src: 'music/animals.mp3', title: 'Animals' },
  { src: 'music/shut.mp3', title: 'Shut Up And Dance With Me' },
  { src: 'music/cant.mp3', title: "Can't Hold Us" },
  { src: 'music/bones.mp3', title: 'Bones' }
]

// --- dom construction ---
const music2bubble = document.createElement('div');
music2bubble.className = 'music2-bubble';
music2bubble.innerHTML = `
  <div class="music2-controls" id="music2-controls">
    <div class="music2-title" id="music2-title"></div>
    <div class="music2-controls-row">
      <button class="music2-btn" id="music2-prev" title="anterior">&#9198;</button>
      <button class="music2-btn" id="music2-playpause" title="play/pause">
        <span id="music2-playpause-icon">&#9654;</span>
      </button>
      <button class="music2-btn" id="music2-next" title="următor">&#9197;</button>
    </div>
    <div class="music2-controls-row">
      <span class="music2-time" id="music2-current-time">0:00</span>
      <input class="music2-seekbar" id="music2-seekbar" type="range" min="0" max="1000" value="0" step="1" disabled>
      <span class="music2-time" id="music2-duration">0:00</span>
    </div>
    <div class="music2-controls-row">
      <span style="font-size:1.1rem;color:#a70042;">🔊</span>
      <input class="music2-slider" id="music2-volume" type="range" min="0" max="1" step="0.01" value="0.3" title="volum">
    </div>
  </div>
  <button class="music2-icon-btn" id="music2-icon-btn" aria-label="control muzică" tabindex="0">
    <span style="pointer-events:auto;">&#119070;</span>
  </button>
  <audio class="music2-audio" id="music2-audio"></audio>
`;
document.body.appendChild(music2bubble);

const music2audio = music2bubble.querySelector('#music2-audio');
const music2title = music2bubble.querySelector('#music2-title');
const music2playpausebtn = music2bubble.querySelector('#music2-playpause');
const music2playpauseicon = music2bubble.querySelector('#music2-playpause-icon');
const music2prevbtn = music2bubble.querySelector('#music2-prev');
const music2nextbtn = music2bubble.querySelector('#music2-next');
const music2seekbar = music2bubble.querySelector('#music2-seekbar');
const music2currenttime = music2bubble.querySelector('#music2-current-time');
const music2duration = music2bubble.querySelector('#music2-duration');
const music2volume = music2bubble.querySelector('#music2-volume');
const music2iconbtn = music2bubble.querySelector('#music2-icon-btn');

let music2index = 0;
let music2isplaying = false;
let music2seekbardragging = false;
let music2lastseek = 0;

// Icon toggles controls (click OR hover)
function showControls() {
  music2bubble.classList.add('show-controls');
}
function hideControls() {
  music2bubble.classList.remove('show-controls');
}
music2iconbtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (music2bubble.classList.contains('show-controls')) {
    hideControls();
  } else {
    showControls();
  }
});
music2iconbtn.addEventListener('mouseenter', showControls);
music2bubble.addEventListener('mouseleave', hideControls);

document.addEventListener("click", function (e) {
  if (
    music2bubble.classList.contains("show-controls") &&
    !music2bubble.contains(e.target)
  ) {
    hideControls();
  }
});

// --- Track Controls ---
function music2settrack(idx, autoplay = false) {
  music2index = idx;
  const track = music2_tracks[idx];
  music2audio.src = track.src;
  music2title.textContent = track.title;
  music2seekbar.value = 0;
  music2seekbar.disabled = true;
  music2currenttime.textContent = "0:00";
  music2duration.textContent = "0:00";
  if (autoplay) {
    music2audio.play();
    music2isplaying = true;
    music2playpauseicon.innerHTML = "&#10073;&#10073;";
  } else {
    music2audio.pause();
    music2isplaying = false;
    music2playpauseicon.innerHTML = "&#9654;";
  }
}
music2prevbtn.addEventListener('click', () => {
  music2settrack((music2index-1+music2_tracks.length)%music2_tracks.length, music2isplaying);
});
music2nextbtn.addEventListener('click', () => {
  music2settrack((music2index+1)%music2_tracks.length, music2isplaying);
});
music2playpausebtn.addEventListener('click', () => {
  if (music2audio.paused) {
    music2audio.play();
  } else {
    music2audio.pause();
  }
});
music2audio.addEventListener('play', () => {
  music2isplaying = true;
  music2playpauseicon.innerHTML = "&#10073;&#10073;";
});
music2audio.addEventListener('pause', () => {
  music2isplaying = false;
  music2playpauseicon.innerHTML = "&#9654;";
});
music2audio.addEventListener('ended', () => {
  music2settrack((music2index+1)%music2_tracks.length, true);
});

// --- Volume Control ---
music2volume.addEventListener('input', () => {
  music2audio.volume = music2volume.value;
});
music2audio.volume = music2volume.value;

// --- Time Slider Logic ---
music2audio.addEventListener('loadedmetadata', () => {
  music2duration.textContent = formattime(music2audio.duration);
  music2currenttime.textContent = formattime(music2audio.currentTime);
  music2seekbar.disabled = false;
  music2seekbar.value = music2audio.duration ? Math.round((music2audio.currentTime / music2audio.duration) * 1000) : 0;
});
music2audio.addEventListener('timeupdate', () => {
  if (!music2seekbardragging && music2audio.duration) {
    music2seekbar.value = Math.round((music2audio.currentTime / music2audio.duration) * 1000);
    music2currenttime.textContent = formattime(music2audio.currentTime);
  }
});
music2seekbar.addEventListener('input', () => {
  if (music2audio.duration) {
    music2seekbardragging = true;
    const seekto = (music2seekbar.value / 1000) * music2audio.duration;
    music2currenttime.textContent = formattime(seekto);
    music2lastseek = seekto;
  }
});
['mousedown', 'touchstart'].forEach(evt =>
  music2seekbar.addEventListener(evt, () => music2seekbardragging = true)
);
['mouseup', 'touchend', 'change'].forEach(evt =>
  music2seekbar.addEventListener(evt, () => {
    if (music2audio.duration && music2seekbardragging) {
      music2audio.currentTime = music2lastseek;
      music2currenttime.textContent = formattime(music2audio.currentTime);
    }
    music2seekbardragging = false;
  })
);

function formattime(time) {
  time = Math.floor(time || 0);
  const m = Math.floor(time / 60);
  const s = time % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

music2settrack(0);
