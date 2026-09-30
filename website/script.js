/**
 * Youssef El Araby - Personal Portfolio
 * Vanilla JavaScript (ES6+) Interactions & Functionality
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Sticky Navigation & Glassmorphism on Scroll
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const handleScrollNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  /* ==========================================================================
     2. Mobile Menu Navigation
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMobileMenu = () => {
    mobileToggle.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileNavMenu.classList.add('is-open');
    mobileNavMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNavMenu.classList.remove('is-open');
    mobileNavMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileNavMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close mobile menu on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     3. Smooth Anchor Scrolling with Sticky Offset
     ========================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - (navHeight + 10);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });

  /* ==========================================================================
     4. Active Navigation Link Spy
     ========================================================================== */
  const navItems = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.scrollY;
    const navHeight = navbar ? navbar.offsetHeight : 80;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - (navHeight + 80);
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     5. Results / Case Studies Tabs
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.results-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  /* ==========================================================================
     6. Fullscreen Accessible Lightbox
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGalleryItems = [];
  let currentImageIndex = 0;
  let lastActiveElement = null;

  // Collect all gallery items
  const galleryItemBoxes = Array.from(document.querySelectorAll('[data-lightbox]'));

  const getVisibleGalleryItems = () => {
    // Only return items currently visible in the active tab panel
    const activePanel = document.querySelector('.results-tab-panel.active');
    if (!activePanel) return galleryItemBoxes;
    const itemsInPanel = Array.from(activePanel.querySelectorAll('[data-lightbox]'));
    return itemsInPanel.length > 0 ? itemsInPanel : galleryItemBoxes;
  };

  const showLightboxImage = (index) => {
    if (!activeGalleryItems.length) return;
    if (index < 0) index = activeGalleryItems.length - 1;
    if (index >= activeGalleryItems.length) index = 0;

    currentImageIndex = index;
    const item = activeGalleryItems[currentImageIndex];
    const imgSrc = item.getAttribute('data-lightbox');
    const caption = item.getAttribute('data-caption') || 'Campaign Result Screenshot';

    lightboxImage.src = imgSrc;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${activeGalleryItems.length}`;
  };

  const openLightbox = (triggerElement) => {
    lastActiveElement = triggerElement;
    activeGalleryItems = getVisibleGalleryItems();
    const clickedIndex = activeGalleryItems.indexOf(triggerElement);
    currentImageIndex = clickedIndex >= 0 ? clickedIndex : 0;

    showLightboxImage(currentImageIndex);

    lightboxModal.classList.add('is-active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    if (lightboxClose) {
      lightboxClose.focus();
    }
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Attach click to thumbnails
  galleryItemBoxes.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });

    // Keyboard support for thumbnails (Enter or Space)
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View ${item.getAttribute('data-caption') || 'campaign result'}`);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentImageIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentImageIndex + 1);
    });
  }

  // Keyboard controls for lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showLightboxImage(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showLightboxImage(currentImageIndex + 1);
    }
  });

  /* ==========================================================================
     7. Copy Email to Clipboard Interaction
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'youssfmohmed1234@gmail.com';

      let copiedSuccessfully = false;

      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(email);
          copiedSuccessfully = true;
        } catch (err) {
          console.warn('Clipboard API writeText failed, attempting execCommand fallback.', err);
        }
      }

      // Fallback for older browsers / iframe contexts
      if (!copiedSuccessfully) {
        try {
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          copiedSuccessfully = document.execCommand('copy');
          document.body.removeChild(tempInput);
        } catch (err) {
          console.error('Fallback clipboard copy failed:', err);
        }
      }

      if (copiedSuccessfully) {
        copyFeedback.classList.add('show');
        copyEmailBtn.style.borderColor = '#10B981';

        setTimeout(() => {
          copyFeedback.classList.remove('show');
          copyEmailBtn.style.borderColor = '';
        }, 3000);
      }
    });
  }

  /* ==========================================================================
     8. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transform = 'translateY(12px)';
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     9. Scroll Reveal Animations (Intersection Observer)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    reveals.forEach(el => revealObserver.observe(el));
  }
});
