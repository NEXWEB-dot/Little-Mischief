/* ============================================
   LITTLE MISCHIEF — Interactive JavaScript
   Navbar scroll, scroll reveals, filters, marquee
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---- Navbar scroll behavior ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMobileMenu);
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMobileMenu();
    }
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenuClose.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeMobileMenu();
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---- Product Filter Buttons ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          // Re-trigger reveal animation
          requestAnimationFrame(() => {
            card.classList.remove('revealed');
            requestAnimationFrame(() => {
              card.classList.add('revealed');
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---- Cart Count (simple demo interaction) ----
  const cartCountEl = document.querySelector('.cart-count');
  let cartCount = 0;

  document.querySelectorAll('.product-card__quick-add').forEach(addBtn => {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartCount++;
      cartCountEl.textContent = cartCount;

      // Visual feedback — brief pulse
      cartCountEl.style.transform = 'scale(1.4)';
      cartCountEl.style.transition = 'transform 0.2s ease';
      setTimeout(() => {
        cartCountEl.style.transform = 'scale(1)';
      }, 200);

      // Change button text briefly
      const originalText = addBtn.textContent;
      addBtn.textContent = '✓ Added!';
      addBtn.style.background = '#25D366';
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.background = '';
      }, 1200);
    });
  });

  // ---- Newsletter Form ----
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter__input');
      const submitBtn = newsletterForm.querySelector('.newsletter__submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Subscribed ✓';
      submitBtn.style.background = '#25D366';
      submitBtn.style.borderColor = '#25D366';
      input.value = '';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
      }, 2500);
    });
  }

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Stat counter animation ----
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    statNumbers.forEach(stat => {
      const text = stat.textContent;
      const hasPlus = text.includes('+');
      const hasK = text.includes('K');
      const hasDot = text.includes('.');
      let targetNum;

      if (hasK) {
        targetNum = parseFloat(text.replace('K+', '').replace('K', ''));
      } else if (hasDot) {
        targetNum = parseFloat(text);
      } else {
        targetNum = parseInt(text.replace('+', '').replace(',', ''));
      }

      let current = 0;
      const duration = 2000;
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = eased * targetNum;

        if (hasK) {
          stat.textContent = current.toFixed(current >= targetNum ? 0 : 0) + 'K' + (hasPlus ? '+' : '');
        } else if (hasDot) {
          stat.textContent = current.toFixed(1);
        } else {
          stat.textContent = Math.round(current) + (hasPlus ? '+' : '');
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Reset to original text
          stat.textContent = text;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Trigger counter animation when hero stats are visible
  const statsSection = document.querySelector('.hero__stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }
});
