document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     HEADER SCROLL EFFECT
  ========================================================= */

  const header =
    document.getElementById('header');

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      'scrolled',
      window.scrollY > 50
    );
  }

  window.addEventListener(
    'scroll',
    updateHeader,
    { passive: true }
  );

  updateHeader();

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle =
    document.getElementById('menuToggle');

  const nav =
    document.getElementById('nav');

  function toggleMenu() {
    if (!menuToggle || !nav) return;

    const isOpen =
      nav.classList.toggle('active');

    menuToggle.classList.toggle(
      'active',
      isOpen
    );

    menuToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );
  }

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove('active');
    menuToggle.classList.remove('active');

    menuToggle.setAttribute(
      'aria-expanded',
      'false'
    );
  }

  if (menuToggle && nav) {
    menuToggle.setAttribute(
      'aria-expanded',
      'false'
    );

    menuToggle.addEventListener(
      'click',
      toggleMenu
    );

    document
      .querySelectorAll('#nav a')
      .forEach(link => {
        link.addEventListener(
          'click',
          closeMenu
        );
      });

    document.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape') {
          closeMenu();
        }
      }
    );

    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      }
    );
  }

  /* =========================================================
     ENGLISH / ARABIC TRANSLATION
  ========================================================= */

  const languageToggle =
    document.getElementById(
      'languageToggle'
    );

  let currentLanguage =
    localStorage.getItem(
      'alumixLanguage'
    ) || 'en';

  function updateLanguage(language) {
    const isArabic =
      language === 'ar';

    currentLanguage =
      isArabic ? 'ar' : 'en';

    /*
      Keep the full page structure LTR so the navbar and
      footer do not move. Arabic content is controlled
      using the arabic-language class.
    */
    document.documentElement.lang =
      currentLanguage;

    document.documentElement.dir =
      'ltr';

    document.body.classList.toggle(
      'arabic-language',
      isArabic
    );

    const translationElements =
      document.querySelectorAll(
        '[data-en][data-ar]'
      );

    translationElements.forEach(
      element => {
        const translatedText =
          isArabic
            ? element.getAttribute(
                'data-ar'
              )
            : element.getAttribute(
                'data-en'
              );

        if (
          translatedText !== null &&
          translatedText !== ''
        ) {
          element.textContent =
            translatedText;
        }
      }
    );

    if (languageToggle) {
      const languageText =
        languageToggle.querySelector(
          'span'
        );

      if (languageText) {
        languageText.textContent =
          isArabic
            ? 'English'
            : 'العربية';
      }

      languageToggle.setAttribute(
        'aria-label',
        isArabic
          ? 'Switch to English'
          : 'Switch to Arabic'
      );

      languageToggle.setAttribute(
        'title',
        isArabic
          ? 'Switch to English'
          : 'Switch to Arabic'
      );
    }

    localStorage.setItem(
      'alumixLanguage',
      currentLanguage
    );
  }

  if (languageToggle) {
    languageToggle.addEventListener(
      'click',
      () => {
        const newLanguage =
          currentLanguage === 'en'
            ? 'ar'
            : 'en';

        updateLanguage(
          newLanguage
        );
      }
    );
  }

  updateLanguage(
    currentLanguage
  );

  /* =========================================================
     SCROLL ANIMATIONS
  ========================================================= */

  const animationTargets =
    document.querySelectorAll(
      '.scroll-animate'
    );

  if (
    'IntersectionObserver' in window
  ) {
    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (
              entry.isIntersecting
            ) {
              entry.target
                .classList.add(
                  'animate'
                );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin:
            '0px 0px -50px 0px'
        }
      );

    animationTargets.forEach(
      element => {
        observer.observe(element);
      }
    );
  } else {
    animationTargets.forEach(
      element => {
        element.classList.add(
          'animate'
        );
      }
    );
  }

  /* =========================================================
     CAROUSEL DRAG-TO-SCROLL
  ========================================================= */

  const track =
    document.getElementById('cTrack');

  if (!track) return;

  const viewport =
    track.parentElement;

  if (!viewport) return;

  let isDragging = false;
  let startX = 0;
  let originalScrollLeft = 0;
  let touchStartX = 0;

  function startDragging() {
    isDragging = true;

    track.classList.add(
      'is-dragging'
    );
  }

  function stopDragging() {
    isDragging = false;

    track.classList.remove(
      'is-dragging'
    );
  }

  track.addEventListener(
    'mousedown',
    event => {
      startDragging();

      startX =
        event.pageX -
        viewport.offsetLeft;

      originalScrollLeft =
        viewport.scrollLeft;
    }
  );

  track.addEventListener(
    'mousemove',
    event => {
      if (!isDragging) return;

      event.preventDefault();

      const currentX =
        event.pageX -
        viewport.offsetLeft;

      const distance =
        (currentX - startX) *
        1.6;

      viewport.scrollLeft =
        originalScrollLeft -
        distance;
    }
  );

  document.addEventListener(
    'mouseup',
    stopDragging
  );

  track.addEventListener(
    'mouseleave',
    stopDragging
  );

  track.addEventListener(
    'touchstart',
    event => {
      if (
        !event.touches ||
        !event.touches[0]
      ) {
        return;
      }

      touchStartX =
        event.touches[0].pageX;

      track.classList.add(
        'is-dragging'
      );
    },
    {
      passive: true
    }
  );

  track.addEventListener(
    'touchmove',
    event => {
      if (
        !event.touches ||
        !event.touches[0]
      ) {
        return;
      }

      const currentX =
        event.touches[0].pageX;

      const distance =
        touchStartX -
        currentX;

      viewport.scrollLeft +=
        distance * 0.7;

      touchStartX =
        currentX;
    },
    {
      passive: true
    }
  );

  track.addEventListener(
    'touchend',
    stopDragging
  );

  track.addEventListener(
    'touchcancel',
    stopDragging
  );

  track.addEventListener(
    'dragstart',
    event => {
      event.preventDefault();
    }
  );
});