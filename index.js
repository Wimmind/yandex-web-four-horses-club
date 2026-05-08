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
  const originalSlides = document.querySelectorAll('.participants-slide');
  const prevBtns = document.querySelectorAll('.participants-btn-prev');
  const nextBtns = document.querySelectorAll('.participants-btn-next');
  const counters = document.querySelectorAll('.participants-current');

  if (!track || !originalSlides.length || !prevBtns.length || !nextBtns.length || !counters.length) return;

  let currentIndex = 0;
  const totalSlides = originalSlides.length;
  const AUTOPLAY_INTERVAL = 4000;
  let autoplayTimer = null;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return totalSlides;
  }

  function setupClones() {
    const existing = track.querySelectorAll('.participants-slide-clone');
    existing.forEach(c => c.remove());

    const count = getSlidesPerView();
    for (let i = 0; i < count; i++) {
      const clone = originalSlides[i].cloneNode(true);
      clone.classList.add('participants-slide-clone');
      track.appendChild(clone);
    }
  }

  function jumpTo(index, animate) {
    if (!animate) track.style.transition = 'none';
    const gap = 20;
    const slideWidth = originalSlides[0].offsetWidth;
    track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
    if (!animate) {
      track.offsetHeight;
      track.style.transition = 'transform 0.5s ease';
    }
  }

  function updateCounter() {
    const display = (currentIndex % totalSlides) + 1;
    counters.forEach(c => { c.textContent = display; });
  }

  function updateCarousel() {
    jumpTo(currentIndex);
    updateCounter();
  }

  function goNext() {
    currentIndex++;
    if (currentIndex > getMaxIndex()) currentIndex = 0;
    updateCarousel();
    if (currentIndex === getMaxIndex()) {
      setTimeout(() => {
        currentIndex = 0;
        jumpTo(0, false);
        updateCounter();
      }, 500);
    }
  }

  function goPrev() {
    if (currentIndex === 0) {
      jumpTo(getMaxIndex(), false);
      currentIndex = getMaxIndex() - 1;
    } else {
      currentIndex--;
    }
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  prevBtns.forEach(btn => btn.addEventListener('click', goPrev));
  nextBtns.forEach(btn => btn.addEventListener('click', goNext));

  const carousel = document.querySelector('.participants-carousel');
  onSwipe(carousel, {}, goNext, goPrev);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupClones();
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateCarousel();
    }, 100);
  });

  setupClones();
  updateCarousel();
  startAutoplay();
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

function initScrollAnimation() {
  const elements = document.querySelectorAll('.scroll-animate');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initStagesSwiper();
  initParticipantsSwiper();
  initScrollHeader();
  initScrollAnimation();
});
