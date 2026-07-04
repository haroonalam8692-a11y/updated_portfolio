/* ============================================================
   Haroon Alam — Portfolio Website
   Complete Vanilla JS (ES6+) — No Dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVBAR SCROLL EFFECT
     ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll);
  // Run once on load in case the page is already scrolled
  handleNavbarScroll();


  /* ----------------------------------------------------------
     2. ACTIVE NAVIGATION LINK (IntersectionObserver)
     ---------------------------------------------------------- */
  const navLinksAll = document.querySelectorAll('.nav-links a');
  const sectionIds = [
    'hero', 'about', 'services', 'portfolio',
    'experience', 'certificates', 'testimonials', 'contact'
  ];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const activateNavLink = (sectionId) => {
    navLinksAll.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${sectionId}`
      );
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ----------------------------------------------------------
     3. SMOOTH SCROLL
     ---------------------------------------------------------- */
  const smoothScrollTo = (targetEl) => {
    if (!targetEl) return;
    const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  document.querySelectorAll('.nav-links a, a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        smoothScrollTo(target);
        // Close mobile menu after clicking a nav link
        closeMobileMenu();
      }
    });
  });


  /* ----------------------------------------------------------
     4. MOBILE HAMBURGER MENU
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  const openMobileMenu = () => {
    navLinks?.classList.add('active');
    hamburger?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    navLinks?.classList.remove('active');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.contains('active');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navLinks?.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });


  /* ----------------------------------------------------------
     5. PORTFOLIO FILTER
     ---------------------------------------------------------- */
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isMatch  = filter === 'all' || category === filter;

        if (!isMatch) {
          // Hide: fade-out then display none
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        } else {
          // Show: display block then fade-in
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        }
      });
    });
  });


  /* ----------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Stop observing once revealed (one-time animation)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     7. TESTIMONIAL CAROUSEL
     ---------------------------------------------------------- */
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn          = document.querySelector('.carousel-prev');
  const nextBtn          = document.querySelector('.carousel-next');
  const dotsContainer    = document.querySelector('.carousel-dots');
  const dots             = document.querySelectorAll('.carousel-dot');

  let currentSlide   = 0;
  let autoRotateId   = null;
  const slideCount   = testimonialCards.length;
  const AUTO_INTERVAL = 5000; // 5 seconds

  const goToSlide = (index) => {
    if (slideCount === 0) return;
    currentSlide = ((index % slideCount) + slideCount) % slideCount; // wrap around
    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Auto-rotate
  const startAutoRotate = () => {
    stopAutoRotate();
    if (slideCount > 1) {
      autoRotateId = setInterval(nextSlide, AUTO_INTERVAL);
    }
  };

  const stopAutoRotate = () => {
    if (autoRotateId) {
      clearInterval(autoRotateId);
      autoRotateId = null;
    }
  };

  // Button listeners
  nextBtn?.addEventListener('click', () => {
    nextSlide();
    startAutoRotate(); // Reset timer after manual nav
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    startAutoRotate();
  });

  // Dot listeners
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoRotate();
    });
  });

  // Pause on hover, resume on leave
  const carouselWrapper = testimonialTrack?.parentElement;
  carouselWrapper?.addEventListener('mouseenter', stopAutoRotate);
  carouselWrapper?.addEventListener('mouseleave', startAutoRotate);

  // Initialize carousel
  if (slideCount > 0) {
    goToSlide(0);
    startAutoRotate();
  }


  /* ----------------------------------------------------------
     8. CONTACT FORM VALIDATION
     ---------------------------------------------------------- */
  const contactForm = document.querySelector('.contact-form');

  /**
   * Show an error on a specific form group.
   * @param {HTMLElement} input  - The input element
   * @param {string}      msg   - Error message to display
   */
  const showError = (input, msg) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    const errorEl = group.querySelector('.error-message');
    if (errorEl) errorEl.textContent = msg;
  };

  /** Clear error state for a form group */
  const clearError = (input) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('error');
    const errorEl = group.querySelector('.error-message');
    if (errorEl) errorEl.textContent = '';
  };

  /** Simple email regex */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Remove error on input / focus
  contactForm?.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('focus', () => clearError(field));
  });

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('[name="name"]');
    const email   = contactForm.querySelector('[name="email"]');
    const subject = contactForm.querySelector('[name="subject"]');
    const message = contactForm.querySelector('[name="message"]');

    let isValid = true;

    // Name validation
    if (!name?.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Name is required and must be at least 2 characters.');
      isValid = false;
    }

    // Email validation
    if (!email?.value.trim()) {
      showError(email, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Subject validation
    if (!subject?.value.trim()) {
      showError(subject, 'Subject is required.');
      isValid = false;
    }

    // Message validation
    if (!message?.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Message is required and must be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // ✅ Success — show toast & reset form
    const toast = document.querySelector('.toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }

    contactForm.reset();
  });


  /* ----------------------------------------------------------
     9. STATS COUNTER ANIMATION
     ---------------------------------------------------------- */
  const heroStats     = document.querySelector('.hero-stats');
  let statsAnimated   = false; // Only trigger once

  const animateCounters = () => {
    if (statsAnimated) return;
    statsAnimated = true;

    const statNumbers = document.querySelectorAll('.stat-number');
    const DURATION    = 2000; // 2 seconds

    statNumbers.forEach(el => {
      const rawText   = el.textContent.trim();           // e.g. "50+"
      const suffix    = rawText.replace(/[\d]/g, '');    // e.g. "+"
      const target    = parseInt(rawText, 10) || 0;      // e.g. 50
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Ease-out quad for a polished feel
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix; // Ensure exact final value
        }
      };

      requestAnimationFrame(step);
    });
  };

  if (heroStats) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(heroStats);
  }


  /* ----------------------------------------------------------
     10. BACK TO TOP BUTTON
     ---------------------------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleBackToTopVisibility = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility);
  handleBackToTopVisibility();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

}); /* end DOMContentLoaded */
