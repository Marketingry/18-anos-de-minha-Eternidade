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
let isAnimating = false;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;

    const direction = index > currentSlide ? 'right' : 'left';

    // Exit current
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add(direction === 'right' ? 'slide-exit-left' : 'slide-exit-right');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    // Prepare new slide entry position (opposite direction)
    slides[currentSlide].style.transform = direction === 'right' ? 'scale(0.9) translateX(40px)' : 'scale(0.9) translateX(-40px)';

    setTimeout(() => {
        // Remove all exit classes
        slides.forEach(s => {
            s.classList.remove('slide-exit-left', 'slide-exit-right');
        });
        slides[currentSlide].style.transform = '';
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

// Button events
document.getElementById('next-btn')?.addEventListener('click', nextSlide);
document.getElementById('prev-btn')?.addEventListener('click', prevSlide);

// Dot events
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index, 10);
        goToSlide(index);
    });
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
        if (Math.abs(dx) > 40) {
            dx < 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });
}

// Auto-advance carousel
let autoPlay = setInterval(nextSlide, 5500);
function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 5500);
}
document.getElementById('next-btn')?.addEventListener('click', resetAutoPlay);
document.getElementById('prev-btn')?.addEventListener('click', resetAutoPlay);

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

// ================================================
// SCROLL-BASED ANIMATIONS
// ================================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.18
};

// Fade in section-inner blocks
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-inner').forEach(el => sectionObserver.observe(el));

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
