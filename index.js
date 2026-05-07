function onSwipe(el, { minDistance = 50 } = {}, onLeft, onRight) {
  let startX = 0;

  el.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) <= minDistance) return;
    if (diff > 0) onLeft();
    else onRight();
  }, { passive: true });
}

function initStagesSwiper() {
  const track = document.querySelector('.stages-track');
  const slides = document.querySelectorAll('.stages-slide');
  const prevBtn = document.querySelector('.stages-btn-prev');
  const nextBtn = document.querySelector('.stages-btn-next');
  const dots = document.querySelectorAll('.stage-dot');

  if (!track || !slides.length || !prevBtn || !nextBtn || !dots.length) return;

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
  });

  const wrapper = document.querySelector('.stages-track-wrapper');
  onSwipe(wrapper, {}, () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  }, () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  updateCarousel();
}

function initParticipantsSwiper() {
  const track = document.querySelector('.participants-track');
  const slides = document.querySelectorAll('.participants-slide');
  const prevBtns = document.querySelectorAll('.participants-btn-prev');
  const nextBtns = document.querySelectorAll('.participants-btn-next');
  const counters = document.querySelectorAll('.participants-current');

  if (!track || !slides.length || !prevBtns.length || !nextBtns.length || !counters.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return totalSlides - getSlidesPerView();
  }

  function updateCarousel() {
    const moveDistance = slides[0].offsetWidth + 20;
    track.style.transform = `translateX(-${currentIndex * moveDistance}px)`;

    counters.forEach((c) => { c.textContent = currentIndex + 1; });
  }

  function goNext() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    updateCarousel();
  }

  function goPrev() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    updateCarousel();
  }

  prevBtns.forEach((btn) => btn.addEventListener('click', goPrev));
  nextBtns.forEach((btn) => btn.addEventListener('click', goNext));

  const carousel = document.querySelector('.participants-carousel');
  onSwipe(carousel, {}, goNext, goPrev);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateCarousel();
    }, 100);
  });

  updateCarousel();
}

function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 0) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  initStagesSwiper();
  initParticipantsSwiper();
  initScrollHeader();
});
