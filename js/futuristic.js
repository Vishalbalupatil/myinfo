/* ========================================
   FUTURISTIC PORTFOLIO - MAIN JAVASCRIPT
   AI & Web3 Theme
   ======================================== */

// ==========================================
// PRELOADER
// ==========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('loaded');
  }, 1500);
});

// ==========================================
// PARTICLE SYSTEM
// ==========================================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.resize();
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const numberOfParticles = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 15000), 100);
    
    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2 + 0.5;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      
      // Smooth gradient blend of AI cyan and Web3 purple based on position
      const ratio = x / this.canvas.width; // 0 (left/AI) to 1 (right/Web3)
      const r = Math.floor(ratio * 150 + Math.random() * 30);
      const g = Math.floor((1 - ratio) * 200 + Math.random() * 55);
      const b = 255;
      const alpha = 0.3 + Math.random() * 0.4;
      const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      
      this.particles.push({ x, y, size, speedX, speedY, color, baseX: x, baseY: y });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }
      
      // Movement
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x > this.canvas.width || p.x < 0) p.speedX *= -1;
      if (p.y > this.canvas.height || p.y < 0) p.speedY *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      
      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.15;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
  new ParticleSystem(particleCanvas);
}

// ==========================================
// NAVIGATION
// ==========================================
const navbar = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll handler for navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  
  // Active nav link based on scroll position
  updateActiveNavLink();
});

// Mobile nav toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Update active nav link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
class Typewriter {
  constructor(element, texts, speed = 80) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = 40;
    this.pauseDuration = 2000;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.currentCharIndex--;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);
    } else {
      this.currentCharIndex++;
      this.element.textContent = currentText.substring(0, this.currentCharIndex);
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.pauseDuration;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize typewriter
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
  new Typewriter(typewriterElement, [
    'Lead QA Engineer | 7+ Years',
    'Web3 Cloud & Blockchain Testing',
    'Automation Test Architect',
    'AI-Driven Quality Assurance',
    'Bridging AI x Web3 Innovation'
  ]);
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer for counters
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statsObserver.observe(statsSection);
}

// ==========================================
// SKILL TABS
// ==========================================
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skill-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetPanel = tab.getAttribute('data-tab');
    
    // Remove active from all tabs and panels
    skillTabs.forEach(t => t.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));
    
    // Add active to clicked tab and corresponding panel
    tab.classList.add('active');
    document.getElementById(targetPanel).classList.add('active');
    
    // Animate skill bars in the active panel
    animateSkillBars(targetPanel);
  });
});

// ==========================================
// SKILL BAR ANIMATION
// ==========================================
function animateSkillBars(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  
  const fills = panel.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    fill.style.width = '0%';
    setTimeout(() => {
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
    }, 100);
  });
}

// Intersection Observer for skill bars
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars('ai-skills');
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  skillsObserver.observe(skillsSection);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================
// AOS INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: false
    });
  }
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('.submit-btn');
    const originalText = btn.querySelector('.btn-text').textContent;
    
    btn.querySelector('.btn-text').textContent = 'Sending...';
    btn.disabled = true;
    
    // Simulate send (replace with actual form handling)
    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = 'Message Sent!';
      btn.style.borderColor = '#00ff88';
      btn.style.color = '#00ff88';
      
      setTimeout(() => {
        btn.querySelector('.btn-text').textContent = originalText;
        btn.disabled = false;
        btn.style.borderColor = '';
        btn.style.color = '';
        contactForm.reset();
      }, 2000);
    }, 1500);
  });
}

// ==========================================
// TILT EFFECT FOR CARDS
// ==========================================
function addTiltEffect(elements) {
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// Apply tilt to stat cards and education cards
document.addEventListener('DOMContentLoaded', () => {
  const tiltElements = document.querySelectorAll('.stat-card, .education-card, .testimonial-card');
  addTiltEffect(tiltElements);
});

// ==========================================
// MATRIX RAIN EFFECT (Background)
// ==========================================
class MatrixRain {
  constructor() {
    this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    this.createDrops();
  }

  createDrops() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    for (let i = 0; i < 15; i++) {
      const drop = document.createElement('div');
      drop.className = 'matrix-drop';
      drop.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${Math.random() * 100}%;
        font-family: 'Orbitron', monospace;
        font-size: ${8 + Math.random() * 6}px;
        color: rgba(0, 240, 255, ${0.05 + Math.random() * 0.1});
        pointer-events: none;
        z-index: 0;
        animation: matrixFall ${5 + Math.random() * 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
        white-space: nowrap;
        writing-mode: vertical-rl;
      `;
      
      let text = '';
      for (let j = 0; j < 15; j++) {
        text += this.chars[Math.floor(Math.random() * this.chars.length)];
      }
      drop.textContent = text;
      heroSection.appendChild(drop);
    }

    // Add the keyframes
    if (!document.getElementById('matrixStyles')) {
      const style = document.createElement('style');
      style.id = 'matrixStyles';
      style.textContent = `
        @keyframes matrixFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MatrixRain();
});

// ==========================================
// SCAN LINE EFFECT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('scanLineStyle')) {
    const style = document.createElement('style');
    style.id = 'scanLineStyle';
    style.textContent = `
      body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        );
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }
});

// ==========================================
// PARALLAX ON HERO
// ==========================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBottom = document.querySelector('.hero-bottom');
  
  if (heroBottom && scrolled < window.innerHeight) {
    heroBottom.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroBottom.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
});

console.log('%c VISHAL PATIL | Lead QA Engineer | AI & Web3 ', 
  'background: linear-gradient(135deg, #00f0ff, #b347ff); color: #0a0a0f; font-family: Orbitron; font-size: 14px; padding: 10px 20px; border-radius: 4px;');
console.log('%c 7+ Years | Automation | Web3 | Blockchain ', 
  'color: #00f0ff; font-family: monospace; font-size: 11px;');
