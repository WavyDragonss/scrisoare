const loveMessages = [
  "Muah! You are my forever Valentine.",
  "You + me = cutest love story ever.",
  "Sending you a million kisses and cuddles.",
  "I love you more every single day."
];

const note = document.getElementById("loveNote");
const button = document.getElementById("loveBtn");
const field = document.getElementById("heartField");

button.addEventListener("click", () => {
  const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  note.textContent = msg;
  burstHearts(14);
});

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

setInterval(() => spawnHeart(), 900);
