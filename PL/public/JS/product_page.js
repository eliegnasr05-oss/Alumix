// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header && window.scrollY > 50) {
    header.classList.add('scrolled');
  } else if (header) {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function toggleMenu() {
  if (nav && menuToggle) {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  }
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', toggleMenu);

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) toggleMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) toggleMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) toggleMenu();
  });
}

// Scroll animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate');
      }, index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

// Language toggle (EN / AR)
// NOTE: uses the "site-language" localStorage key — if team_page.js (or
// any other page) already stores the language choice under a different
// key, rename this to match so the toggle stays in sync across pages.
const LANG_STORAGE_KEY = 'site-language';
const languageToggle = document.getElementById('languageToggle');

function applyLanguage(lang) {
  const isArabic = lang === 'ar';

  document.body.classList.toggle('arabic-language', isArabic);

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = isArabic ? (el.dataset.ar || el.dataset.en) : el.dataset.en;
    el.textContent = text;
  });

  if (languageToggle) {
    const label = languageToggle.querySelector('span');
    if (label) label.textContent = isArabic ? 'English' : 'العربية';
    languageToggle.setAttribute(
      'aria-label',
      isArabic ? 'Switch to English' : 'Switch to Arabic'
    );
  }
}

function initLanguage() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  applyLanguage(saved);
}

if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    const isArabic = document.body.classList.contains('arabic-language');
    const nextLang = isArabic ? 'en' : 'ar';
    localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    applyLanguage(nextLang);
  });
}

initLanguage();