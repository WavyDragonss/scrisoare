const countdownEl = document.getElementById("countdown");
const targetDate = new Date("2025-01-26T00:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff > 0) {
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `Mai sunt ${d} zile, ${h} ore, ${m} minute și ${s} secunde de la prima zi`;
  } else {
    const passed = now - targetDate;
    const d = Math.floor(passed / (1000 * 60 * 60 * 24));
    const h = Math.floor((passed / (1000 * 60 * 60)) % 24);
    const m = Math.floor((passed / (1000 * 60)) % 60);
    const s = Math.floor((passed / 1000) % 60);
    countdownEl.textContent = `Au trecut ${d} zile, ${h} ore, ${m} minute și ${s} secunde de la prima zi 💖`;
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

function createFallingEmoji() {
  const el = document.createElement('div');
  el.classList.add('heart');
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = Math.random() * 10 + 20 + "px";
  el.style.animationDuration = (Math.random() * 3 + 2) + "s";
  el.innerText = Math.random() < 0.8 ? "❤️" : "🪷";
  document.getElementById("falling-container").appendChild(el);
  setTimeout(() => el.remove(), 5000);
}
setInterval(createFallingEmoji, 300);

// Întrebările, fiecare răspuns individual, cu hint separat
const questions = [
  { question: "Băutura mea preferată?", answers: ["ciocolata calda"], pattern: "Cio_____a ____a", hint: "hot" },
  { question: "Băutura mea preferată?", answers: ["babyccino"], pattern: "B____c____", hint: "Babyyyy" },
  { question: "Băutura mea preferată?", answers: ["fanta"], pattern: "F____a", hint: "orange" },
  { question: "Băutura mea preferată?", answers: ["fanta cu portocale"], pattern: "F____a cu _________", hint: "ORANGESSS" },
  { question: "My favourite hang out place?", answers: ["your place"], pattern: "Y___ p___e", hint: "home" },
  { question: "My favourite hang out place?", answers: ["cabana"], pattern: "C____a", hint: "balcon" },
  { question: "My favourite hang out place?", answers: ["simos"], pattern: "S___s", hint: "mare sau mic" },
  { question: "My favourite hang out place?", answers: ["penny"], pattern: "P____", hint: "NO HINT NEEDED" },
  { question: "My favourite hang out place?", answers: ["mario"], pattern: "M___o", hint: "snitzel" },
  { question: "DOAMNA ______ __ TELEVIZOR", answers: ["SUNTEM LA"], pattern: "DOAMNA ______ __ TELEVIZOR", hint: "Încearcă majuscule" },
  { question: "Completează propoziția: 'Et si __ _'________ ___'", answers: ["tu n'existais pas"], pattern: "Et si __ _'________ ___", hint: "n'existais" }
];

let usedIndexes = new Set();
let index = -1;

function pickNewQuestion() {
  if (usedIndexes.size === questions.length) usedIndexes.clear();
  do {
    index = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.has(index));
  usedIndexes.add(index);
  setQuestion();
  document.getElementById("password").value = "";
  document.getElementById("hint").textContent = `Hint: ${questions[index].hint}`;
}

function setQuestion() {
  const q = questions[index];
  document.getElementById("questionText").textContent = q.question;
  document.getElementById("patternText").textContent = q.pattern;
  document.getElementById("hintText").textContent = ""; // resetăm la load
}

function checkPassword() {
  const input = document.getElementById("password").value.trim();

  if (input === "!") { // cheat code ca să deblocheze
    unlockScreen();
    return;
  }

  const q = questions[index];
  const lowerInput = input.toLowerCase();

  if (q.question.includes("DOAMNA")) {
    if (input.toUpperCase() !== input) {
      alert("Încearcă cu MAJUSCULE");
      return;
    }
  }

  if (q.answers.some(ans => ans.toLowerCase() === lowerInput)) {
    unlockScreen();
  } else {
    alert("Hmm, nu chiar. Încearcă din nou sau apasă pe hint!");
  }
}

function unlockScreen() {
  document.getElementById("lockScreen").style.display = 'none';
  document.body.style.overflow = 'auto';
  document.getElementById("mainContent").classList.remove("blurred");
}

window.onload = () => {
  pickNewQuestion();
  document.getElementById("mainContent").classList.add("blurred");
};

const showHintBtn = document.getElementById('showHintBtn');
const hintText = document.getElementById('hintText');

showHintBtn.addEventListener('mousedown', () => {
  hintText.textContent = "Hint: " + questions[index].hint;
  hintText.style.display = 'inline';
});
showHintBtn.addEventListener('mouseup', () => hintText.style.display = 'none');
showHintBtn.addEventListener('mouseleave', () => hintText.style.display = 'none');

// Optional: suport pentru touch
showHintBtn.addEventListener('touchstart', () => {
  hintText.textContent = "Hint: " + questions[index].hint;
  hintText.style.display = 'inline';
});
showHintBtn.addEventListener('touchend', () => hintText.style.display = 'none');

<script>
  const musicTracks = [
    { src: 'music/lotus_ambient.mp3', title: 'I Wanna Be Yours' },
    { src: 'music/preput.mp3', title: 'Preput' },
    { src: 'music/animals.mp3', title: 'Animals' },
    { src: 'music/shut.mp3', title: 'Shut Up And Dance With Me' },
    { src: 'music/cant.mp3', title: "Can't Hold Us" },
    { src: 'music/bones.mp3', title: 'Bones' }
  ];

  const audio = document.getElementById('background-music');
  const toggleButton = document.getElementById('music-toggle');

  let isPlaying = false;
  let currentTrack = 0;

  // Set volume (30%)
  audio.volume = 0.3;

  // Load first track
  function loadTrack(index) {
    audio.src = musicTracks[index].src;
    audio.load();
  }

  loadTrack(currentTrack);

  // Start music on first user interaction (mobile autoplay fix)
  function startMusicOnce() {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        toggleButton.textContent = '🔊';
      }).catch((e) => {
        console.warn('Autoplay blocked:', e);
        toggleButton.textContent = '🔇';
      });
    }
    window.removeEventListener('touchstart', startMusicOnce);
    window.removeEventListener('click', startMusicOnce);
  }

  // Attach user interaction listeners
  window.addEventListener('touchstart', startMusicOnce, { once: true });
  window.addEventListener('click', startMusicOnce, { once: true });

  // Toggle music manually
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent re-triggering
    if (isPlaying) {
      audio.pause();
      toggleButton.textContent = '🔇';
    } else {
      audio.play().then(() => {
        toggleButton.textContent = '🔊';
      }).catch(() => {
        toggleButton.textContent = '🔇';
      });
    }
    isPlaying = !isPlaying;
  });

  // Autoplay next track when one ends
  audio.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % musicTracks.length;
    loadTrack(currentTrack);
    audio.play();
  });
</script>
