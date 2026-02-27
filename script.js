/* ============================================================
   DEBORATO CHAUDHURY — PORTFOLIO  |  script.js  v2.0
   Features: Preloader, Cursor, Scroll Reveal, Parallax,
             Hero Canvas, Scramble Text, Tilt Cards,
             Magnetic Buttons, Horizontal Drag Scroll,
             Scroll Progress, Nav Shrink, Active Nav,
             Counter Animations, Contact Form, Scroll Top,
             Mobile Menu, Click Sound
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   1. PRELOADER
───────────────────────────────────────────── */
(function initPreloader() {
  const preNum    = document.getElementById('preloader-num');
  const preBar    = document.getElementById('preloader-bar');
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  let count = 0;
  const tick = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) count = 100;
    preNum.textContent = String(count).padStart(2, '0');
    preBar.style.width = count + '%';
    if (count === 100) {
      clearInterval(tick);
      setTimeout(() => {
        preloader.style.transition = 'opacity 0.6s ease';
        preloader.style.opacity    = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          // Trigger page-in curtain
          const curtain = document.getElementById('curtain');
          if (curtain) {
            curtain.classList.add('out');
            setTimeout(() => curtain.classList.remove('out'), 500);
          }
          startScrambles();
        }, 600);
      }, 300);
    }
  }, 35);
})();

/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR  (smooth lag ring)
───────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const txt  = document.getElementById('cursor-text');
  if (!dot) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    dot.style.transform  = `translate(${mx - 5}px,${my - 5}px)`;
    ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
    txt.style.transform  = `translate(${mx + 14}px,${my - 14}px)`;
    requestAnimationFrame(loop);
  })();

  // Hover expand
  document.querySelectorAll('a, button, .proj-card, .skill-card, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Drag label on scroll wrapper
  const wrapper = document.querySelector('.projects-scroll-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      txt.textContent = 'Drag';
      document.body.classList.add('cursor-drag', 'cursor-text-show');
    });
    wrapper.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-drag', 'cursor-text-show');
    });
  }
})();

/* ─────────────────────────────────────────────
   3. HERO CANVAS  (animated particle mesh)
───────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,240,96,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connect() {
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,240,96,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  })();
})();

/* ─────────────────────────────────────────────
   4. TEXT SCRAMBLE  (hero title)
───────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function scrambleElement(el, delay = 0) {
  const original = el.dataset.text || el.textContent;
  el.textContent = original;
  let frame = 0;
  const totalFrames = 20;
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent = original
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < (frame / totalFrames) * original.length) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      frame++;
      if (frame > totalFrames) { el.textContent = original; clearInterval(iv); }
    }, 40);
  }, delay);
}

function startScrambles() {
  document.querySelectorAll('.scramble-word').forEach((el, i) => scrambleElement(el, i * 180));
}

/* ─────────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Trigger counter if needed
        if (e.target.querySelector('.counter')) {
          e.target.querySelectorAll('.counter').forEach(animateCounter);
        }
        if (e.target.classList.contains('counter')) {
          animateCounter(e.target);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────────
   6. ANIMATED COUNTERS
───────────────────────────────────────────── */
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const dur     = 1200;
  const start   = performance.now();
  (function tick(now) {
    const progress = Math.min((now - start) / dur, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + '+';
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + '+';
  })(start);
}

/* ─────────────────────────────────────────────
   7. HERO PARALLAX
───────────────────────────────────────────── */
(function initParallax() {
  const bgText = document.getElementById('heroBgText');
  if (!bgText) return;
  window.addEventListener('scroll', () => {
    bgText.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.28}px))`;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   8. SCROLL PROGRESS BAR
───────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   9. NAV: shrink on scroll + active highlight
───────────────────────────────────────────── */
(function initNav() {
  const nav     = document.getElementById('nav');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ─────────────────────────────────────────────
   10. MOBILE HAMBURGER MENU
───────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function toggle() {
    const isOpen = btn.classList.toggle('open');
    menu.style.display = isOpen ? 'flex' : 'none';
    setTimeout(() => { if (isOpen) menu.classList.add('open'); }, 10);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);

  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      setTimeout(() => { menu.style.display = 'none'; }, 400);
      document.body.style.overflow = '';
    });
  });
})();

/* ─────────────────────────────────────────────
   11. 3D TILT ON SKILL CARDS
───────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;
      card.style.transform  = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
      card.style.boxShadow  = `${-x * 12}px ${y * 12}px 30px rgba(200,240,96,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ─────────────────────────────────────────────
   12. MAGNETIC BUTTONS
───────────────────────────────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width  / 2;
      const cy = top  + height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ─────────────────────────────────────────────
   13. HORIZONTAL DRAG SCROLL (Projects)
───────────────────────────────────────────── */
(function initDragScroll() {
  const wrapper = document.querySelector('.projects-scroll-wrapper');
  const track   = document.getElementById('projectsTrack');
  if (!wrapper || !track) return;

  let isDown = false, startX, scrollLeft;

  wrapper.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
    document.body.classList.add('cursor-drag');
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    document.body.classList.remove('cursor-drag');
  });
  wrapper.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.4;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  let touchStartX, touchScrollLeft;
  wrapper.addEventListener('touchstart', e => {
    touchStartX  = e.touches[0].pageX;
    touchScrollLeft = wrapper.scrollLeft;
  }, { passive: true });
  wrapper.addEventListener('touchmove', e => {
    const walk = (e.touches[0].pageX - touchStartX) * 1.4;
    wrapper.scrollLeft = touchScrollLeft - walk;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────
   14. SCROLL TO TOP BUTTON
───────────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────
   15. CONTACT FORM  (mock submit)
───────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    // Simulate network delay
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 4000);
    }, 1200);
  });
})();

/* ─────────────────────────────────────────────
   16. CLICK SOUND  (subtle tick)
───────────────────────────────────────────── */
(function initSound() {
  function playTick() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    } catch (_) { /* AudioContext not available */ }
  }

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', playTick);
  });
})();