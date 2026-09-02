// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) { 
        header.classList.add('scrolled'); 
    } else { 
        header.classList.remove('scrolled'); 
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function toggleMenu() { 
    nav.classList.toggle('active'); 
    menuToggle.classList.toggle('active'); 
}

menuToggle.addEventListener('click', toggleMenu);

// Close menu when clicking nav links
document.querySelectorAll('nav a').forEach(link => { 
    link.addEventListener('click', () => { 
        if(nav.classList.contains('active')) {
            toggleMenu(); 
        }
    }); 
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => { 
    if(e.key === 'Escape' && nav.classList.contains('active')) {
        toggleMenu(); 
    }
});

// Close menu on window resize (desktop)
window.addEventListener('resize', () => { 
    if(window.innerWidth > 768 && nav.classList.contains('active')) {
        toggleMenu(); 
    }
});

// Scroll animations - Updated to target specific elements
const observerOptions = { 
    threshold: 0.15, 
    rootMargin: '0px 0px -50px 0px' 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => { 
        if(entry.isIntersecting) { 
            setTimeout(() => { 
                entry.target.classList.add('animate'); 
            }, index * 100); 
        }
    });
}, observerOptions);

// Observe elements that need animation
document.querySelectorAll('.scroll-animate, .stat-item, .feature-card, .section-title, .video-wrapper').forEach(el => observer.observe(el));

// Stagger effect for feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => { 
    card.style.transitionDelay = `${index * 0.15}s`; 
});

// Stagger effect for stat items
document.querySelectorAll('.stat-item').forEach((item, index) => { 
    item.style.transitionDelay = `${index * 0.1}s`; 
});

// Video play/pause on click
const video = document.getElementById('video');
if (video) {
    video.addEventListener('click', () => {
        if(video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active')) {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle) {
            toggleMenu();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector("#alumixCarousel");
    if (el && window.bootstrap) {
        new bootstrap.Carousel(el, {
        interval: 3000,
        ride: "carousel",
        pause: false,
        wrap: true
        });
    }
});

// ============ Language Toggle (EN / AR) ============
// Nav bar and footer are intentionally EXCLUDED from language switching —
// they always stay in their original text and layout direction.
(function () {
    const STORAGE_KEY = 'alumix-lang';
    const langToggle = document.getElementById('langToggle');
    const toggleText = langToggle ? langToggle.querySelector('.lang-toggle-text') : null;

    function applyLang(lang) {
        const isAr = lang === 'ar';

        document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', isAr);

        // Swap every element tagged with data-en / data-ar,
        // EXCEPT anything inside the nav bar or footer — those stay fixed.
        document.querySelectorAll('[data-en]').forEach((el) => {
            if (el.closest('header, nav, footer')) return;
            const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
            if (text !== null) {
                el.textContent = text;
            }
        });

        // Button shows the language you'd switch TO
        if (toggleText) {
            toggleText.textContent = isAr ? 'EN' : 'AR';
        }

        localStorage.setItem(STORAGE_KEY, lang);
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
            applyLang(current === 'ar' ? 'en' : 'ar');
        });
    }

    // Restore saved preference (or default to English) on every page load
    const saved = localStorage.getItem(STORAGE_KEY) || 'en';
    applyLang(saved);
})();