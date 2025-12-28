document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, index * 80);
  });
});
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

if (menuToggle && mobileMenu && overlay) {
  const firstLink = mobileMenu.querySelector('a');

  // Toggle menu and manage focus + ARIA
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('show');
    overlay.classList.toggle('show', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    if (isOpen) {
      if (firstLink) firstLink.focus();
    } else {
      menuToggle.focus();
    }
  });

  const closeMenu = () => {
    mobileMenu.classList.remove('show');
    overlay.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    menuToggle.focus();
  };

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
      closeMenu();
    }
  });

  // Project reveal: IntersectionObserver + reduced-motion support
  const cards = document.querySelectorAll('.project-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    cards.forEach(card => card.classList.add('show'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = Number(card.dataset.index) || 0;
          const delay = Math.min(index * 80, 400);
          card.style.transitionDelay = `${delay}ms`;
          card.classList.add('show');
          obs.unobserve(card);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0' });

    cards.forEach((card, index) => {
      card.dataset.index = index;
      observer.observe(card);
    });

    // Also reveal cards already visible on load (useful when page opens already scrolled)
    window.addEventListener('load', () => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          const idx = Number(card.dataset.index) || 0;
          const delay = Math.min(idx * 80, 400);
          card.style.transitionDelay = `${delay}ms`;
          card.classList.add('show');
          observer.unobserve(card);
        }
      });
    });
  } else {
    // Fallback
    cards.forEach((card, i) => setTimeout(() => card.classList.add('show'), Math.min(i * 80, 400)));
  }
}

// Quick debug: force visibility of project cards (remove in production)
function debugForceShowCards() {
  const cards = document.querySelectorAll('.project-card');
  console.log('DEBUG: found project-card count =', cards.length);
  cards.forEach((card, i) => {
    card.classList.add('show');
    card.style.transition = 'none';
    card.style.opacity = '1';
    card.style.transform = 'none';
    console.log(`DEBUG: card[${i}] text=`, card.textContent.trim(), 'computed opacity=', getComputedStyle(card).opacity);
  });
}

// Run once on load for testing
window.addEventListener('load', () => {
  console.log('DEBUG: window.load fired');
  debugForceShowCards();
});
