/* =========================================
   NEXUS.AGENCY — Creative Studio Animations
   ========================================= */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, MotionPathPlugin);
 
/* ---------- 1. Custom Cursor ---------- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0 });
});
const cursorLoop = () => {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
  requestAnimationFrame(cursorLoop);
};
cursorLoop();

document.querySelectorAll('a, button, .project, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hover'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

/* ---------- 2. Neural Network Background ---------- */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 18));
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
  });
}
function drawNetwork() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#00ffd5';
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.strokeStyle = `rgba(0, 255, 213, ${1 - dist / 130})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawNetwork);
}
drawNetwork();

/* ---------- 3. Loader ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const pct = document.getElementById('loaderPercent');
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => loader.style.display = 'none'
      });
      heroIntro();
    }
  });
  const obj = { v: 0 };
  tl.to(obj, {
    v: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => pct.textContent = Math.floor(obj.v) + '%'
  });
});

/* ---------- 4. Hero Intro Animation ---------- */
function heroIntro() {
  const tl = gsap.timeline();

  // Title lines slide up
  tl.to('.title-text', {
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power4.out'
  })
  .from('.hero-tag', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1')
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.hero-cta .btn', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
  .from('.stat', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
  .from('.orb', { scale: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, '-=1.2')
  .from('.orb-ring', { scale: 0, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '-=1')
  .from('.orb-core', { scale: 0, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
  .from('.orbit-tag', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2)' }, '-=0.4')
  .from('.scroll-indicator', { opacity: 0, y: -20, duration: 0.8 }, '-=0.2');

  // Animate stat numbers
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      delay: 1.5,
      onUpdate: () => el.textContent = Math.floor(obj.v),
      onComplete: () => el.textContent = target
    });
  });
}

/* ---------- 5. Magnetic Buttons ---------- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ---------- 6. Smooth Scroll Nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: 'power3.inOut'
      });

      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        document.querySelector('.navbar').classList.remove('open');
        document.querySelector('.menu-toggle').classList.remove('open');
      }
    }
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const navbar = document.querySelector('.navbar');

if (menuToggle && menuClose && navbar) {
  const toggleMenu = () => {
    navbar.classList.toggle('open');
    menuToggle.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  };

  menuToggle.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', toggleMenu);
}

/* ---------- 7. Section title parallax reveal ---------- */
gsap.utils.toArray('.section-title').forEach(title => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      once: true,
    },
    y: 60,
    opacity: 0.2,
    clearProps: 'transform, opacity',
  });
});

/* ---------- 8. About — text line reveal + bars ---------- */
gsap.utils.toArray('.reveal-text').forEach((p, i) => {
  gsap.from(p, {
    scrollTrigger: { trigger: p, start: 'top 85%', once: true },
    y: 40,
    opacity: 0,
    duration: 1,
    delay: i * 0.1,
    ease: 'power3.out',
    clearProps: 'transform, opacity'
  });
});

ScrollTrigger.create({
  trigger: '.card-bars',
  start: 'top 75%',
  once: true,
  onEnter: () => document.querySelectorAll('.bar').forEach(b => b.classList.add('in')),
});

/* About card 3D tilt */
const cardInner = document.querySelector('.card-inner');
if (cardInner) {
  document.querySelector('.about-card').addEventListener('mousemove', (e) => {
    const rect = cardInner.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardInner, { rotationY: x * 20, rotationX: -y * 20, duration: 0.6, ease: 'power3.out' });
  });
  document.querySelector('.about-card').addEventListener('mouseleave', () => {
    gsap.to(cardInner, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' });
  });
}

/* ---------- 9. Projects — color & slide reveal ---------- */
document.querySelectorAll('.project').forEach((p, i) => {
  const color = p.dataset.color;
  p.style.setProperty('--project-color', color);
  gsap.from(p.querySelectorAll('.project-num, .project-content > *'), {
    scrollTrigger: { trigger: p, start: 'top 80%', once: true },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: i * 0.05,
    clearProps: 'transform, opacity'
  });
  // Background color sweep on scroll
  gsap.to(p, {
    scrollTrigger: { trigger: p, start: 'top 70%', end: 'bottom 30%', scrub: 1 },
    '--opacity': 0.1
  });
});

/* ---------- 10. Skills — Tilt + Reveal ---------- */
gsap.utils.toArray('.skill-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay: i * 0.1,
    ease: 'power3.out',
    clearProps: 'transform, opacity'
  });
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: x * 12,
      rotationX: -y * 12,
      y: -8,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 800
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, y: 0, duration: 0.7, ease: 'power3.out' });
  });
});

/* ---------- 11. Marquee Infinite Scroll ---------- */
gsap.to('.marquee-track', {
  xPercent: -50,
  duration: 30,
  ease: 'none',
  repeat: -1
});

/* ---------- 12. Orb motion path ---------- */
gsap.to('.orb', {
  motionPath: {
    path: [{ x: 0, y: 0 }, { x: 30, y: -20 }, { x: 0, y: 0 }, { x: -30, y: 20 }, { x: 0, y: 0 }],
    curviness: 2,
    autoRotate: false
  },
  duration: 12,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});

/* Orb rings counter-rotate */
gsap.to('.orb-core', {
  scale: 1.2,
  duration: 2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
});

/* ---------- 13. Nav scroll style change ---------- */
gsap.to('.navbar', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'bottom top',
    end: '+=200',
    scrub: 0.5
  },
  backgroundColor: 'rgba(5, 6, 10, 0.9)',
  borderColor: 'rgba(232, 236, 244, 0.15)'
});

/* ---------- 14. Contact form submit ---------- */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn span');
  const original = btn.textContent;
  gsap.timeline()
    .to(btn, { duration: 0.3, text: 'TRANSMITTING...' })
    .to(btn, {
      duration: 0.6, text: '✓ MESSAGE SENT',
      delay: 0.8,
      onComplete: () => {
        setTimeout(() => {
          gsap.to(btn, { duration: 0.3, text: original, onComplete: () => e.target.reset() });
        }, 1800);
      }
    });
});

/* ---------- 15. Horizontal parallax on hero content ---------- */
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    toggleActions: 'play none none reverse'
  },
  y: 100,
  opacity: 0.3,
  clearProps: 'transform, opacity'
});
gsap.to('.hero-visual', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    toggleActions: 'play none none reverse'
  },
  y: -80,
  scale: 0.7,
  clearProps: 'transform, opacity'
});

/* ---------- 16. Floating orbit tags ---------- */
gsap.utils.toArray('.orbit-tag').forEach((tag, i) => {
  gsap.to(tag, {
    y: '+=12',
    duration: 2 + i * 0.3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
});

/* ---------- 17. Subtle scroll progress on the right edge ---------- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; right: 0; width: 3px; height: 0;
  background: linear-gradient(180deg, var(--accent), var(--accent-2));
  z-index: 9999; transform-origin: top;
`;
document.body.appendChild(progressBar);
gsap.to(progressBar, {
  scaleY: 1,
  height: '100vh',
  transformOrigin: 'top',
  ease: 'none',
  scrollTrigger: { scrub: 0.3 }
});

/* ---------- 18. Refresh on resize ---------- */
window.addEventListener('resize', () => ScrollTrigger.refresh());
