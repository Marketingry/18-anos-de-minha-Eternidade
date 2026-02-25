/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

// ================================================
// CARTA BLOQUEADA — Libera em 9 de março às 7h (UTC-3)
// ================================================
// Data alvo: 2026-03-09 07:00:00 horário de Brasília (UTC-3)
const UNLOCK_DATE = new Date('2026-03-09T07:00:00-03:00');

function checkLetterLock() {
  const now = new Date();
  const locked = document.getElementById('letter-locked');
  const revealed = document.getElementById('letter-revealed');

  if (now >= UNLOCK_DATE) {
    // Desbloquear carta
    if (locked) locked.style.display = 'none';
    if (revealed) {
      revealed.style.display = 'flex';
      // Iniciar observadores da carta após exibi-la
      initLetterReveal();
    }
    return true; // carta desbloqueada
  }
  return false; // ainda bloqueada
}

function updateCountdown() {
  const now = new Date();
  const diff = UNLOCK_DATE - now;

  if (diff <= 0) {
    checkLetterLock();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  if (elDays) elDays.textContent = pad(days);
  if (elHours) elHours.textContent = pad(hours);
  if (elMins) elMins.textContent = pad(minutes);
  if (elSecs) elSecs.textContent = pad(seconds);
}

// Inicializar verificação
const isUnlocked = checkLetterLock();
if (!isUnlocked) {
  updateCountdown(); // renderizar imediatamente
  setInterval(updateCountdown, 1000);
}

// ================================================
// START EXPERIENCE (scroll to video)
// ================================================
function startExperience() {
  document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' });
}

// ================================================
// CAROUSEL
// ================================================
let currentSlide = 0;
let isAnimating = false;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
  if (isAnimating || index === currentSlide) return;
  isAnimating = true;

  const direction = index > currentSlide ? 'right' : 'left';

  // Sair do slide atual
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add(direction === 'right' ? 'slide-exit-left' : 'slide-exit-right');
  dots[currentSlide].classList.remove('active');

  currentSlide = index;

  setTimeout(() => {
    slides.forEach(s => s.classList.remove('slide-exit-left', 'slide-exit-right'));
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    isAnimating = false;
  }, 50);
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  goToSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(prev);
}

document.getElementById('next-btn')?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
document.getElementById('prev-btn')?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index, 10);
    goToSlide(index);
    resetAutoPlay();
  });
});

// Touch / swipe no carrossel
let touchStartX = 0;
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
  carouselTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carouselTrack.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
  }, { passive: true });
}

// Auto-avanço
let autoPlay = setInterval(nextSlide, 5500);
function resetAutoPlay() {
  clearInterval(autoPlay);
  autoPlay = setInterval(nextSlide, 5500);
}

// ================================================
// MAP TOOLTIP
// ================================================
let tooltipTimer = null;

function showTooltip(element, text) {
  const tooltip = document.getElementById('map-tooltip');
  if (!tooltip) return;

  tooltip.textContent = text;
  tooltip.style.top = '10px';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.classList.add('visible');

  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 3200);
}

// ================================================
// SCROLL-BASED FADE-IN (section-inner)
// ================================================
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-inner').forEach(el => sectionObserver.observe(el));

// ================================================
// INTRO FADE IN ON LOAD
// ================================================
window.addEventListener('load', () => {
  const intro = document.querySelector('.intro-content');
  if (intro) {
    intro.style.opacity = '0';
    intro.style.transform = 'translateY(28px)';
    intro.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      intro.style.opacity = '1';
      intro.style.transform = 'none';
    }));
  }
});

// ================================================
// LETTER BLOCKS — reveal ao rolar
// ================================================
function initLetterReveal() {
  const letterBlocks = document.querySelectorAll('.letter-block-hidden');
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('letter-block-hidden');
          entry.target.classList.add('letter-block-revealed');
        }, i * 180);
        letterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  letterBlocks.forEach(block => letterObserver.observe(block));
}

// Se carta já estiver desbloqueada ao carregar, inicializar diretamente
if (isUnlocked) initLetterReveal();

// ================================================
// FLOATING NAV — ocultar na hero section
// ================================================
const floatingNav = document.getElementById('floating-nav');
const introSection = document.getElementById('intro');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (floatingNav) {
      floatingNav.style.opacity = entry.isIntersecting ? '0' : '1';
      floatingNav.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      floatingNav.style.transition = 'opacity 0.4s';
    }
  });
}, { threshold: 0.5 });

if (introSection) navObserver.observe(introSection);

console.log('💕 Olá Anna Victoria! Este site foi feito com muito amor pelo Ryan.');
