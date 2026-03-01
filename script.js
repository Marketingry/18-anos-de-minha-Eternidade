/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ================================================
    // START EXPERIENCE — scroll pro vídeo
    // ================================================
    window.startExperience = function () {
        var target = document.getElementById('video');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    };

    // ================================================
    // CAROUSEL (fixed: DOM queries inside DOMContentLoaded)
    // ================================================
    var currentSlide = 0;
    var isAnimating = false;
    var slides = document.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        if (isAnimating || index === currentSlide || slides.length === 0) return;
        isAnimating = true;

        var direction = index > currentSlide ? 'right' : 'left';

        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add(direction === 'right' ? 'slide-exit-left' : 'slide-exit-right');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = index;

        setTimeout(function () {
            slides.forEach(function (s) { s.classList.remove('slide-exit-left', 'slide-exit-right'); });
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            isAnimating = false;
        }, 50);
    }

    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
    function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

    var nextBtn = document.getElementById('next-btn');
    var prevBtn = document.getElementById('prev-btn');
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(dot.dataset.index, 10));
            resetAutoPlay();
        });
    });

    // Swipe no toque
    var touchStartX = 0;
    var track = document.getElementById('carousel-track');
    if (track) {
        track.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
        }, { passive: true });
    }

    // Auto-avanço a cada 5.5 segundos
    var autoPlay = setInterval(nextSlide, 5500);
    function resetAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, 5500);
    }

    // ================================================
    // ENVELOPE CARD — abrir carta ao clicar
    // ================================================
    window.openLetter = function () {
        var envelope = document.getElementById('envelope-card');
        var letterRevealed = document.getElementById('letter-revealed');

        if (envelope) {
            envelope.classList.add('opening');
            setTimeout(function () {
                envelope.style.display = 'none';
                if (letterRevealed) {
                    letterRevealed.style.display = 'flex';
                    letterRevealed.classList.add('letter-fade-in');
                    initLetterReveal();
                }
            }, 900);
        }
    };

    // ================================================
    // LETTER BLOCKS — revelar ao rolar
    // ================================================
    function initLetterReveal() {
        var letterBlocks = document.querySelectorAll('.letter-block-hidden');
        if (letterBlocks.length === 0) return;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.classList.remove('letter-block-hidden');
                        entry.target.classList.add('letter-block-revealed');
                    }, i * 180);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        letterBlocks.forEach(function (block) { obs.observe(block); });
    }

    // ================================================
    // MAP TOOLTIP
    // ================================================
    var tooltipTimer = null;
    window.showTooltip = function (element, text) {
        var tooltip = document.getElementById('map-tooltip');
        if (!tooltip) return;
        tooltip.textContent = text;
        tooltip.style.top = '10px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.classList.add('visible');
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(function () { tooltip.classList.remove('visible'); }, 3200);
    };

    // ================================================
    // INTRO FADE IN ON LOAD
    // ================================================
    var intro = document.querySelector('.intro-content');
    if (intro) {
        intro.style.opacity = '0';
        intro.style.transform = 'translateY(28px)';
        intro.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
        setTimeout(function () {
            intro.style.opacity = '1';
            intro.style.transform = 'none';
        }, 120);
    }

    // ================================================
    // FLOATING NAV — ocultar enquanto hero estiver visível
    // ================================================
    var floatingNav = document.getElementById('floating-nav');
    var introSection = document.getElementById('intro');
    if (floatingNav && introSection) {
        var navObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                floatingNav.style.opacity = entry.isIntersecting ? '0' : '1';
                floatingNav.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
                floatingNav.style.transition = 'opacity 0.4s';
            });
        }, { threshold: 0.5 });
        navObs.observe(introSection);
    }

    console.log('💕 Olá Anna Victoria! Este site foi feito com muito amor pelo Ryan.');
});
