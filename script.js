/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

// ================================================
// SPLASH — Countdown até 25/02/2026 00:00:00 (UTC-3)
// ================================================
const BIRTHDAY_MIDNIGHT = new Date('2026-02-25T00:00:00-03:00');

// ---- Confetti engine (canvas puro, sem library) ----
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiPieces = [];
let confettiRunning = false;

function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function randomBetween(a, b) { return a + Math.random() * (b - a); }

const CONFETTI_COLORS = ['#C23B3B', '#F5E6D3', '#fff', '#e07070', '#f8baba', '#FFD700', '#FF69B4', '#c8f542'];

function createConfettiPiece() {
  return {
    x: randomBetween(0, confettiCanvas.width),
    y: randomBetween(-confettiCanvas.height * 0.3, -20),
    r: randomBetween(5, 12),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    dx: randomBetween(-2.5, 2.5),
    dy: randomBetween(3, 7),
    tilt: randomBetween(-10, 10),
    dtilt: randomBetween(-1, 1),
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    alpha: 1,
  };
}

function spawnConfetti(count = 180) {
  resizeConfettiCanvas();
  for (let i = 0; i < count; i++) {
    confettiPieces.push(createConfettiPiece());
  }
}

function animateConfetti() {
  if (!confettiCtx || !confettiCanvas) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach(p => {
    confettiCtx.save();
    confettiCtx.globalAlpha = p.alpha;
    confettiCtx.fillStyle = p.color;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.tilt * Math.PI) / 180);

    if (p.shape === 'rect') {
      confettiCtx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }
    confettiCtx.restore();

    // Mover
    p.x += p.dx;
    p.y += p.dy;
    p.tilt += p.dtilt;

    // Fade out perto do fundo
    if (p.y > confettiCanvas.height * 0.7) p.alpha -= 0.012;
  });

  // Remover peças invisíveis e repor
  confettiPieces = confettiPieces.filter(p => p.alpha > 0);
  if (confettiRunning && confettiPieces.length < 80) spawnConfetti(60);

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

function startConfetti() {
  confettiRunning = true;
  resizeConfettiCanvas();
  spawnConfetti(200);
  animateConfetti();
  // Parar de criar novos após 6s e deixar os existentes caírem
  setTimeout(() => { confettiRunning = false; }, 6000);
}

window.addEventListener('resize', resizeConfettiCanvas);

// ---- Som de celebração (Web Audio API) ----
function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.38, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
      osc.start(start);
      osc.stop(start + 0.8);
    });
  } catch (e) { /* silencioso se browser bloquear */ }
}

// ---- Lógica principal do splash ----
const splashEl = document.getElementById('birthday-splash');
const contentEl = document.getElementById('splash-content');
const boomEl = document.getElementById('splash-boom');
const spHours = document.getElementById('sp-hours');
const spMins = document.getElementById('sp-mins');
const spSecs = document.getElementById('sp-secs');

let splashInterval = null;
let boomFired = false;

function pad(n) { return String(n).padStart(2, '0'); }

function fireBoom() {
  if (boomFired) return;
  boomFired = true;

  // Trocar tela
  if (contentEl) contentEl.style.display = 'none';
  if (boomEl) boomEl.style.display = 'block';

  // Confetes + som
  startConfetti();
  playCelebrationSound();
}

function updateSplashCountdown() {
  const now = new Date();
  const diff = BIRTHDAY_MIDNIGHT - now;

  if (diff <= 0) {
    clearInterval(splashInterval);
    // Zerar o contador visualmente
    if (spHours) spHours.textContent = '00';
    if (spMins) spMins.textContent = '00';
    if (spSecs) spSecs.textContent = '00';
    fireBoom();
    return;
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  if (spHours) spHours.textContent = pad(h);
  if (spMins) spMins.textContent = pad(m);
  if (spSecs) spSecs.textContent = pad(s);
}

// Verificar se já passou da meia-noite ao carregar
const now = new Date();
if (now >= BIRTHDAY_MIDNIGHT) {
  // Já passou — mostrar tela boom direto
  if (contentEl) contentEl.style.display = 'none';
  if (boomEl) boomEl.style.display = 'block';
  startConfetti();
} else {
  // Ainda não chegou — iniciar countdown
  document.body.classList.add('splash-active');
  updateSplashCountdown();
  splashInterval = setInterval(updateSplashCountdown, 1000);
}

// ---- Entrar no site ao clicar no botão ----
function enterSite() {
  confettiRunning = false;
  if (splashEl) {
    splashEl.classList.add('hiding');
    setTimeout(() => {
      splashEl.style.display = 'none';
      document.body.classList.remove('splash-active');
    }, 900);
  }
}

// ================================================
// CARTA BLOQUEADA — Libera em 9 de março às 7h (UTC-3)
// ================================================
const UNLOCK_DATE = new Date('2026-03-09T07:00:00-03:00');

function checkLetterLock() {
  const locked = document.getElementById('letter-locked');
  const revealed = document.getElementById('letter-revealed');
  if (new Date() >= UNLOCK_DATE) {
    if (locked) locked.style.display = 'none';
    if (revealed) {
      revealed.style.display = 'flex';
      initLetterReveal();
    }
    return true;
  }
  return false;
}

function updateLetterCountdown() {
  const diff = UNLOCK_DATE - new Date();
  if (diff <= 0) { checkLetterLock(); return; }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const el = id => document.getElementById(id);
  if (el('cd-days')) el('cd-days').textContent = pad(days);
  if (el('cd-hours')) el('cd-hours').textContent = pad(hours);
  if (el('cd-mins')) el('cd-mins').textContent = pad(minutes);
  if (el('cd-secs')) el('cd-secs').textContent = pad(seconds);
}

const letterUnlocked = checkLetterLock();
if (!letterUnlocked) {
  updateLetterCountdown();
  setInterval(updateLetterCountdown, 1000);
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

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

document.getElementById('next-btn')?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
document.getElementById('prev-btn')?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index, 10)); resetAutoPlay(); });
});

let touchStartX = 0;
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
  carouselTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carouselTrack.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
  }, { passive: true });
}

let autoPlay = setInterval(nextSlide, 5500);
function resetAutoPlay() { clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 5500); }

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
// SCROLL FADE-IN (section-inner)
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
// INTRO FADE IN
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
// LETTER REVEAL (blocos da carta)
// ================================================
function initLetterReveal() {
  const blocks = document.querySelectorAll('.letter-block-hidden');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('letter-block-hidden');
          entry.target.classList.add('letter-block-revealed');
        }, i * 180);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  blocks.forEach(b => obs.observe(b));
}

if (letterUnlocked) initLetterReveal();

// ================================================
// FLOATING NAV — hide na hero
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
