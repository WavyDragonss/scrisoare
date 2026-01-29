// Carousel config—CHANGE THIS FOR YOUR IMAGE FILES
const CAROUSEL_IMAGES = Array.from({length: 35}, (_, i) => ({
  src: `images/${i+1}.jpg`,
  alt: `Photo ${i+1}`
}));

let carouselIndex = 0;
let carouselEls = {};

function createCarousel(containerSelector = '.collage-section') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Remove old carousel if re-creating
  let old = container.querySelector('.carousel-wrapper');
  if (old) old.remove();

  // Wrapper
  const carousel = document.createElement('div');
  carousel.className = 'carousel-wrapper';
  container.appendChild(carousel);

  // Arrows
  const left = document.createElement('button');
  left.className = 'carousel-arrow';
  left.innerHTML = '‹';
  left.setAttribute('aria-label', 'Previous photo');

  const right = document.createElement('button');
  right.className = 'carousel-arrow';
  right.innerHTML = '›';
  right.setAttribute('aria-label', 'Next photo');

  // Image area
  const imgArea = document.createElement('div');
  imgArea.className = 'carousel-img-area';
  carousel.appendChild(left);
  carousel.appendChild(imgArea);
  carousel.appendChild(right);

  // Image elements for fade
  const imgEls = CAROUSEL_IMAGES.map(info => {
    const el = document.createElement('img');
    el.className = 'carousel-img';
    el.src = info.src;
    el.alt = info.alt;
    imgArea.appendChild(el);
    return el;
  });

  // Dots/pager
  const pager = document.createElement('div');
  pager.className = 'carousel-pager';
  const dots = CAROUSEL_IMAGES.map((img, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    pager.appendChild(dot);
    dot.addEventListener('click', () => showCarouselSlide(i));
    return dot;
  });
  carousel.appendChild(pager);

  // Carousel logic
  function showCarouselSlide(i) {
    carouselIndex = (i + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    imgEls.forEach((imgEl, j) => {
      imgEl.classList.toggle('visible', j === carouselIndex);
    });
    dots.forEach((dot, j) => dot.classList.toggle('active', j === carouselIndex));
  }
  left.addEventListener('click', () => showCarouselSlide(carouselIndex - 1));
  right.addEventListener('click', () => showCarouselSlide(carouselIndex + 1));

  // Mobile swipe
  let sx, sy;
  imgArea.addEventListener('touchstart', e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  imgArea.addEventListener('touchend', e => {
    if (sx !== undefined) {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = Math.abs(e.changedTouches[0].clientY - sy);
      if (Math.abs(dx) > 40 && dy < 80) {
        if (dx < 0) showCarouselSlide(carouselIndex + 1);
        else showCarouselSlide(carouselIndex - 1);
      }
    }
    sx = undefined; sy = undefined;
  }, { passive: true });

  showCarouselSlide(0);

  carouselEls = { carousel, imgEls, dots, left, right, imgArea };
}

// Expose for manual call
window.createCarousel = createCarousel;