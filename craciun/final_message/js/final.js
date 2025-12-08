document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back-btn');

  // Create a falling container and start snow using shared engine
  const snowContainer = document.createElement('div');
  snowContainer.id = 'falling-elements-final';
  snowContainer.style.position = 'fixed';
  snowContainer.style.inset = '0';
  snowContainer.style.pointerEvents = 'none';
  snowContainer.style.zIndex = '0';
  document.body.appendChild(snowContainer);

  if (typeof initLightSnow === 'function') {
    initLightSnow(snowContainer, 40);
  } else {
    console.warn('initLightSnow not found; ensure ../wheel_game/js/snow.js is loaded.');
  }

  backBtn.addEventListener('click', () => {
    window.history.back();
  });
});