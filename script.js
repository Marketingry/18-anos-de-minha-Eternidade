/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

// ================================================
// CARTA BLOQUEADA — Libera em 9 de março às 7h (UTC-3, horário de Brasília)
// ================================================
const UNLOCK_DATE = new Date('2026-03-09T07:00:00-03:00');

function checkLetterLock() {
    const now = new Date();
    const locked = document.getElementById('letter-locked');
    const revealed = document.getElementById('letter-revealed');

    if (now >= UNLOCK_DATE) {
        if (locked) locked.style.display = 'none';
        if (revealed) {
            revealed.style.display = 'flex';
            initLetterReveal();
        }
        return true;
    }
    return false;
}

function updateCountdown() {
    const elDays = document.getElementById('cd-days');
    if (!elDays) return; // Se não achar o primeiro, a página ainda não carregou os IDs

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

    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-mins');
    const elSecs = document.getElementById('cd-secs');

    elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(minutes);
    if (elSecs) elSecs.textContent = pad(seconds);
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const isUnlocked = checkLetterLock();
    if (!isUnlocked) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});


// ================================================
// START EXPERIENCE — scroll pro vídeo
// ================================================
function startExperience() {
    const target = document.getElementById('video');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}

// ================================================
// CAROUSEL
// ================================================
let currentSlide = 0;
let isAnimating = false;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    if (isAnimating || index === currentSlide || slides.length === 0) return;
    isAnimating = true;

    const direction = index > currentSlide ? 'right' : 'left';

    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add(direction === 'right' ? 'slide-exit-left' : 'slide-exit-right');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = index;

    setTimeout(() => {
        slides.forEach(s => s.classList.remove('slide-exit-left', 'slide-exit-right'));
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        isAnimating = false;
    }, 50);
}

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

document.getElementById('next-btn')?.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
document.getElementById('prev-btn')?.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index, 10));
        resetAutoPlay();
    });
});

// Swipe no toque
let touchStartX = 0;
const track = document.getElementById('carousel-track');
if (track) {
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
    }, { passive: true });
}

// Auto-avanço a cada 5.5 segundos
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
// INTRO FADE IN ON LOAD
// ================================================
window.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro-content');
    if (intro) {
        intro.style.opacity = '0';
        intro.style.transform = 'translateY(28px)';
        intro.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
        // Pequeno delay para garantir que o CSS foi aplicado
        setTimeout(() => {
            intro.style.opacity = '1';
            intro.style.transform = 'none';
        }, 120);
    }
});

// ================================================
// LETTER BLOCKS — revelar ao rolar (carta desbloqueada)
// ================================================
function initLetterReveal() {
    const letterBlocks = document.querySelectorAll('.letter-block-hidden');
    if (letterBlocks.length === 0) return;

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
    }, { threshold: 0.15 });

    letterBlocks.forEach(block => obs.observe(block));
}

// Se já estiver desbloqueada ao carregar, inicializar direto
if (isUnlocked) {
    document.addEventListener('DOMContentLoaded', initLetterReveal);
}

// ================================================
// FLOATING NAV — ocultar enquanto hero estiver visível
// ================================================
const floatingNav = document.getElementById('floating-nav');
const introSection = document.getElementById('intro');

if (floatingNav && introSection) {
    const navObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            floatingNav.style.opacity = entry.isIntersecting ? '0' : '1';
            floatingNav.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
            floatingNav.style.transition = 'opacity 0.4s';
        });
    }, { threshold: 0.5 });
    navObs.observe(introSection);
}

console.log('💕 Olá Anna Victoria! Este site foi feito com muito amor pelo Ryan.');
