// =====================================================
// HEADER SCROLL EFFECT
// =====================================================

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');

  if (header && window.scrollY > 50) {
    header.classList.add('scrolled');
  } else if (header) {
    header.classList.remove('scrolled');
  }
});


// =====================================================
// MOBILE MENU TOGGLE
// =====================================================

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
      if (nav.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      nav.classList.contains('active')
    ) {
      toggleMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (
      window.innerWidth > 768 &&
      nav.classList.contains('active')
    ) {
      toggleMenu();
    }
  });
}


// =====================================================
// SCROLL ANIMATIONS
// =====================================================

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }

  });

}, observerOptions);

document
  .querySelectorAll('.scroll-animate')
  .forEach(el => observer.observe(el));


// =====================================================
// ACCORDION
// ONLY ONE CARD OPEN AT A TIME
// =====================================================

function initializeAccordion(lang) {

  const suffix = lang === 'ar' ? 'Ar' : 'En';

  const missionCard =
    document.getElementById(`missionCard${suffix}`);

  const visionCard =
    document.getElementById(`visionCard${suffix}`);

  if (!missionCard || !visionCard) return;

  const cards = [
    missionCard,
    visionCard
  ];


  // -----------------------------------------
  // Close all cards initially
  // -----------------------------------------

  cards.forEach(card => {

    card.classList.remove('active');

    const body =
      card.querySelector('.mv-body');

    if (body) {
      body.style.maxHeight = '0';
    }

  });


  // -----------------------------------------
  // Add click events
  // -----------------------------------------

  cards.forEach(card => {

    const header =
      card.querySelector('.mv-header');

    if (!header) return;


    // Clone header to remove old listeners
    const newHeader =
      header.cloneNode(true);

    header.parentNode.replaceChild(
      newHeader,
      header
    );


    // -----------------------------------------
    // Accordion click
    // -----------------------------------------

    newHeader.addEventListener(
      'click',
      function () {

        const isCurrentlyActive =
          card.classList.contains('active');


        // Close all cards
        cards.forEach(c => {

          c.classList.remove('active');

          const body =
            c.querySelector('.mv-body');

          if (body) {
            body.style.maxHeight = '0';
          }

        });


        // Open clicked card
        if (!isCurrentlyActive) {

          card.classList.add('active');

          const body =
            card.querySelector('.mv-body');

          if (body) {

            // Use actual content height
            body.style.maxHeight =
              body.scrollHeight + 'px';

          }

        }

      }
    );

  });

}


// =====================================================
// LANGUAGE TOGGLE
// Synced with the site-wide "alumix-lang" localStorage key
// used on the home page, so switching language on any page
// carries over to every other page (navbar/footer included).
// =====================================================

const LANG_STORAGE_KEY = 'alumix-lang';

const langToggle = document.getElementById('langToggle');
const aboutAr = document.getElementById('aboutAr');
const aboutEn = document.getElementById('aboutEn');

function applyLang(lang) {

  const isAr = lang === 'ar';

  // ---------------------------------------
  // Site-wide flip: html dir/lang + body.rtl
  // This is what re-styles the navbar and
  // footer, matching the home page behavior.
  // ---------------------------------------

  document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.body.classList.toggle('rtl', isAr);

  // ---------------------------------------
  // Swap any shared nav/footer/hero strings
  // tagged with data-en / data-ar
  // ---------------------------------------

  document.querySelectorAll('[data-en]').forEach((el) => {
    const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (text !== null) {
      el.textContent = text;
    }
  });

  // ---------------------------------------
  // About page specific: swap the long-form
  // English / Arabic content blocks
  // ---------------------------------------

  if (aboutAr && aboutEn) {

    if (isAr) {
      aboutEn.style.display = 'none';
      aboutAr.style.display = 'block';
    } else {
      aboutAr.style.display = 'none';
      aboutEn.style.display = 'block';
    }

    // Re-close and re-bind the accordion for
    // whichever language is now visible
    setTimeout(() => {
      initializeAccordion(isAr ? 'ar' : 'en');
    }, 50);
  }

  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    applyLang(current === 'ar' ? 'en' : 'ar');
  });
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // Close all accordion cards before init
  document.querySelectorAll('.mv-card').forEach(card => {
    card.classList.remove('active');
    const body = card.querySelector('.mv-body');
    if (body) {
      body.style.maxHeight = '0';
    }
  });

  // Restore whatever language was chosen elsewhere on
  // the site (defaults to English on a first visit)
  const saved = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  applyLang(saved);

});