/* ================================================
   ANNA VICTORIA — BIRTHDAY PAGE JAVASCRIPT
   ================================================ */

// Aguarda o DOM estar totalmente carregado antes de qualquer coisa
document.addEventListener('DOMContentLoaded', function () {

  // ================================================
  // SPLASH — Countdown até 25/02/2026 00:00:00 (Brasília UTC-3)
  // ================================================

  // Timestamp exato da meia-noite de Brasília (UTC-3)
  var BIRTHDAY_TARGET = Date.parse('2026-02-25T00:00:00-03:00');

  var splashEl = document.getElementById('birthday-splash');
  var contentEl = document.getElementById('splash-content');
  var boomEl = document.getElementById('splash-boom');
  var spHours = document.getElementById('sp-hours');
  var spMins = document.getElementById('sp-mins');
  var spSecs = document.getElementById('sp-secs');

  var boomFired = false;
  var splashInterval = null;

  function zpad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function updateSplashCountdown() {
    var diff = BIRTHDAY_TARGET - Date.now();

    if (diff <= 0) {
      // Zerar visualmente
      if (spHours) spHours.textContent = '00';
      if (spMins) spMins.textContent = '00';
      if (spSecs) spSecs.textContent = '00';

      clearInterval(splashInterval);
      fireBoom();
      return;
    }

    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    if (spHours) spHours.textContent = zpad(h);
    if (spMins) spMins.textContent = zpad(m);
    if (spSecs) spSecs.textContent = zpad(s);
  }

  function fireBoom() {
    if (boomFired) return;
    boomFired = true;

    if (contentEl) contentEl.style.display = 'none';
    if (boomEl) boomEl.style.display = 'block';

    startConfetti();
    playCelebrationSound();
  }

  // Arrancar
  if (Date.now() >= BIRTHDAY_TARGET) {
    // Já passou da meia-noite — mostrar boom diretamente
    if (contentEl) contentEl.style.display = 'none';
    if (boomEl) boomEl.style.display = 'block';
    startConfetti();
  } else {
    // Ativar countdown
    document.body.classList.add('splash-active');
    updateSplashCountdown(); // rodar imediatamente
    splashInterval = setInterval(updateSplashCountdown, 1000);
  }

  // ================================================
  // CONFETTI ENGINE
  // ================================================
  var confettiCanvas = document.getElementById('confetti-canvas');
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  var confettiPieces = [];
  var confettiRunning = false;

  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  var COLORS = ['#C23B3B', '#F5E6D3', '#fff', '#e07070', '#f8baba', '#FFD700', '#FF69B4', '#a8f542'];

  function newPiece() {
    var w = confettiCanvas ? confettiCanvas.width : window.innerWidth;
    var h = confettiCanvas ? confettiCanvas.height : window.innerHeight;
    return {
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.3,
      r: 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      dx: -2.5 + Math.random() * 5,
      dy: 3 + Math.random() * 4,
      tilt: -10 + Math.random() * 20,
      dtilt: -1 + Math.random() * 2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      alpha: 1
    };
  }

  function spawnConfetti(count) {
    resizeCanvas();
    for (var i = 0; i < count; i++) confettiPieces.push(newPiece());
  }

  function drawConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    var h = confettiCanvas.height;
    var surviving = [];

    for (var i = 0; i < confettiPieces.length; i++) {
      var p = confettiPieces[i];
      confettiCtx.save();
      confettiCtx.globalAlpha = p.alpha;
      confettiCtx.fillStyle = p.color;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.tilt * Math.PI / 180);
      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();

      p.x += p.dx;
      p.y += p.dy;
      p.tilt += p.dtilt;
      if (p.y > h * 0.72) p.alpha -= 0.014;

      if (p.alpha > 0) surviving.push(p);
    }

    confettiPieces = surviving;

    // Reabastecer enquanto confetti ativo
    if (confettiRunning && confettiPieces.length < 90) spawnConfetti(60);

    if (confettiPieces.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else if (confettiCtx) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function startConfetti() {
    confettiRunning = true;
    spawnConfetti(220);
    drawConfetti();
    setTimeout(function () { confettiRunning = false; }, 7000);
  }

  window.addEventListener('resize', resizeCanvas);

  // ================================================
  // SOM DE CELEBRAÇÃO (Web Audio API)
  // ================================================
  function playCelebrationSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        var t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.38, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.start(t);
        osc.stop(t + 0.8);
      });
    } catch (e) { /* navegador bloqueou — silêncio */ }
  }

  // ================================================
  // ENTRAR NO SITE (botão do boom)
  // ================================================
  window.enterSite = function () {
    confettiRunning = false;
    if (splashEl) {
      splashEl.classList.add('hiding');
      setTimeout(function () {
        splashEl.style.display = 'none';
        document.body.classList.remove('splash-active');
      }, 900);
    }
  };

  // ================================================
  // CARTA BLOQUEADA — Libera em 9 de março às 7h (UTC-3)
  // ================================================
  var UNLOCK_DATE = Date.parse('2026-03-09T07:00:00-03:00');

  function checkLetterLock() {
    var locked = document.getElementById('letter-locked');
    var revealed = document.getElementById('letter-revealed');
    if (Date.now() >= UNLOCK_DATE) {
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
    var diff = UNLOCK_DATE - Date.now();
    if (diff <= 0) { checkLetterLock(); return; }

    var days = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    var elDays = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMins = document.getElementById('cd-mins');
    var elSecs = document.getElementById('cd-secs');

    if (elDays) elDays.textContent = zpad(days);
    if (elHours) elHours.textContent = zpad(h);
    if (elMins) elMins.textContent = zpad(m);
    if (elSecs) elSecs.textContent = zpad(s);
  }

  var letterUnlocked = checkLetterLock();
  if (!letterUnlocked) {
    updateLetterCountdown();
    setInterval(updateLetterCountdown, 1000);
  }

  // ================================================
  // SCROLL TO VIDEO
  // ================================================
  window.startExperience = function () {
    var el = document.getElementById('video');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ================================================
  // CAROUSEL
  // ================================================
  var currentSlide = 0;
  var isAnimating = false;
  var slides = document.querySelectorAll('.carousel-slide');
  var dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;
    var dir = index > currentSlide ? 'right' : 'left';

    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add(dir === 'right' ? 'slide-exit-left' : 'slide-exit-right');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;

    setTimeout(function () {
      slides.forEach(function (s) { s.classList.remove('slide-exit-left', 'slide-exit-right'); });
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      isAnimating = false;
    }, 50);
  }

  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

  var nextBtn = document.getElementById('next-btn');
  var prevBtn = document.getElementById('prev-btn');
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAP(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAP(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goToSlide(parseInt(dot.dataset.index, 10)); resetAP();
    });
  });

  var touchStartX = 0;
  var track = document.getElementById('carousel-track');
  if (track) {
    track.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) { if (dx < 0) nextSlide(); else prevSlide(); resetAP(); }
    }, { passive: true });
  }

  var autoPlay = setInterval(nextSlide, 5500);
  function resetAP() { clearInterval(autoPlay); autoPlay = setInterval(nextSlide, 5500); }

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
  // SCROLL FADE-IN (section-inner)
  // ================================================
  var secObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        secObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-inner').forEach(function (el) { secObserver.observe(el); });

  // ================================================
  // INTRO FADE IN
  // ================================================
  var intro = document.querySelector('.intro-content');
  if (intro) {
    intro.style.opacity = '0';
    intro.style.transform = 'translateY(28px)';
    intro.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        intro.style.opacity = '1';
        intro.style.transform = 'none';
      });
    });
  }

  // ================================================
  // LETTER REVEAL (blocos da carta)
  // ================================================
  function initLetterReveal() {
    var blocks = document.querySelectorAll('.letter-block-hidden');
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
    }, { threshold: 0.2 });
    blocks.forEach(function (b) { obs.observe(b); });
  }

  if (letterUnlocked) initLetterReveal();

  // ================================================
  // FLOATING NAV — hide na hero
  // ================================================
  var floatingNav = document.getElementById('floating-nav');
  var introSection = document.getElementById('intro');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (floatingNav) {
        floatingNav.style.opacity = entry.isIntersecting ? '0' : '1';
        floatingNav.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        floatingNav.style.transition = 'opacity 0.4s';
      }
    });
  }, { threshold: 0.5 });

  if (introSection) navObserver.observe(introSection);

  console.log('💕 Olá Anna Victoria! Feito com muito amor pelo Ryan. Faltam: ' +
    Math.max(0, Math.floor((BIRTHDAY_TARGET - Date.now()) / 1000)) + ' segundo(s).');

}); // fim do DOMContentLoaded
