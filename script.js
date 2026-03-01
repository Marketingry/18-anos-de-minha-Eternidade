/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

// ---- START EXPERIENCE (scroll to video) ----
function startExperience() {
    document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' });
    // Optionally start background music
    // const music = document.getElementById('bg-music');
    // if (music) { music.volume = 0.18; music.play().catch(() => {}); }
}

// ================================================
// CAROUSEL
// ================================================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    if (index === currentSlide || index < 0 || index >= slides.length) return;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

document.getElementById('next-btn')?.addEventListener('click', nextSlide);
document.getElementById('prev-btn')?.addEventListener('click', prevSlide);

dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index, 10)));
});

// Touch / swipe support
let touchStartX = 0;
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
    }, { passive: true });
}

// Auto-advance
let autoPlay = setInterval(nextSlide, 5500);
document.getElementById('next-btn')?.addEventListener('click', () => { clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 5500); });
document.getElementById('prev-btn')?.addEventListener('click', () => { clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 5500); });

// ================================================
// MAP TOOLTIP
// ================================================
let tooltipTimer = null;

function showTooltip(element, text) {
    const tooltip = document.getElementById('map-tooltip');
    const mapArea = document.querySelector('.map-area');
    if (!tooltip || !mapArea) return;

    tooltip.textContent = text;
    tooltip.classList.add('visible');

    // Position near the top center of the map
    tooltip.style.top = '12px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';

    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
        tooltip.classList.remove('visible');
    }, 3000);
}


// Fade in intro content on load
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.querySelector('.intro-content');
        if (intro) {
            intro.style.opacity = '0';
            intro.style.transform = 'translateY(30px)';
            intro.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    intro.style.opacity = '1';
                    intro.style.transform = 'none';
                });
            });
        }
    }, 200);
});

// ================================================
// LETTER REVEAL ON SCROLL
// ================================================
const letterBlocks = document.querySelectorAll('.letter-block-hidden');

const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.remove('letter-block-hidden');
                entry.target.classList.add('letter-block-revealed');
            }, i * 150);
            letterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

letterBlocks.forEach(block => letterObserver.observe(block));

// ================================================
// FLOATING NAV — hide/show on Hero section
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

// ================================================
// POLAROID hover amplify (click on carousel)
// ================================================
document.querySelectorAll('.carousel-slide .polaroid').forEach(p => {
    p.addEventListener('click', () => {
        p.style.transform = 'scale(1.06)';
        setTimeout(() => { p.style.transform = ''; }, 300);
    });
});

console.log('💕 Olá Anna Victoria! Este site foi feito com muito amor.');
