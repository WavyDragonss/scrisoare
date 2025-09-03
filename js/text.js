// Splash sequence script
let started = false;
const splash = document.getElementById('splash');
const message = splash.querySelector('.message');
const turnImage = document.getElementById('turnImage');

// Preload image fallback (in case <link rel="preload"> doesn't work)
const preloadImg = new window.Image();
preloadImg.src = 'img/turn.jpg';

// Hide image/message initially
message.textContent = '';
message.classList.remove('visible', 'pulse');
turnImage.classList.remove('visible', 'fading');
turnImage.style.visibility = 'hidden';

// Utility: show and animate an element
function showElem(elem, text = null, extraClass = null) {
  if (text !== null) elem.textContent = text;
  elem.classList.add('visible');
  if (extraClass) elem.classList.add(extraClass);
  elem.style.visibility = 'visible';
}

// Utility: hide an element (with fade)
function hideElem(elem, extraClass = null) {
  elem.classList.remove('visible');
  if (extraClass) elem.classList.remove(extraClass);
  elem.style.visibility = 'hidden';
}

// Listen for first pointer interaction
function onFirstInteraction() {
  if (started) return;
  started = true;

  // Prevent scroll, lock interaction to splash
  document.body.style.overflow = 'hidden';

  // Step 1: Wait 1s
  setTimeout(() => {
    // Step 2: Show "Turn your phone" + image (fade/scale in)
    showElem(message, 'Turn your phone');
    showElem(turnImage);
    // Step 3: Keep visible for 2s
    setTimeout(() => {
      // Step 4: Fade out image, change message to "Tap to continue" with pulse
      turnImage.classList.add('fading');
      setTimeout(() => {
        hideElem(turnImage, 'fading');
      }, 320); // Fade duration (matches CSS)
      showElem(message, 'Tap to continue', 'pulse');
      // At this point, splash sequence is done.
      // Optionally: wait for next tap to proceed (out of scope per instructions)
    }, 2000); // 2s image duration
  }, 1000); // 1s initial delay
}

// Listen for pointerdown, fallback to touchstart/click if needed
window.addEventListener('pointerdown', onFirstInteraction, { once: true });
window.addEventListener('touchstart', onFirstInteraction, { once: true });
window.addEventListener('click', onFirstInteraction, { once: true });

/* Accessibility: If user prefers reduced motion, show instantly */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  showElem(message, 'Turn your phone');
  showElem(turnImage);
  setTimeout(() => {
    hideElem(turnImage);
    showElem(message, 'Tap to continue', 'pulse');
  }, 1000); // Shorter sequence for reduced motion
}