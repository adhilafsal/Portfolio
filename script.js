/**
 * ADHIL AFSAL - PROFESSIONAL PERSONAL PORTFOLIO
 * Vanilla JavaScript Engine
 * Modules: Theme Switcher, ScrollSpy Navigation, Mobile Drawer,
 *          Copy Actions, Form Validation & Mailto Modal, Dynamic Elements
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT WITH SYSTEM & LOCALSTORAGE SUPPORT)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('adhil_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || savedTheme === 'dark') {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('adhil_theme', newTheme);
    });
  }

  /* ------------------------------------------------------------------------
     2. STICKY HEADER & SCROLLSPY NAVIGATION
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('site-header');
  const trackedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  let ticking = false;

  const onScroll = () => {
    const scrollPos = window.scrollY;

    // Header elevation on scroll
    if (siteHeader) {
      if (scrollPos > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link detection
    const headerOffset = (siteHeader ? siteHeader.offsetHeight : 72) + 60;

    trackedSections.forEach((section) => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  const openMobileMenu = () => {
    if (!mobileToggleBtn || !mobileDrawer) return;
    mobileToggleBtn.classList.add('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };

  const closeMobileMenu = () => {
    if (!mobileToggleBtn || !mobileDrawer) return;
    mobileToggleBtn.classList.remove('open');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileToggleBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
        mobileToggleBtn.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. COPY EMAIL ACTION
     ------------------------------------------------------------------------ */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailValueSpan = document.getElementById('email-value');

  if (copyEmailBtn && emailValueSpan) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailText = emailValueSpan.textContent.trim();
      const copyLabel = copyEmailBtn.querySelector('.copy-label') || copyEmailBtn;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailText);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = emailText;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalText = copyLabel.textContent;
        copyLabel.textContent = 'Copied!';
        copyEmailBtn.style.borderColor = 'var(--accent)';
        copyEmailBtn.style.color = 'var(--accent)';

        setTimeout(() => {
          copyLabel.textContent = originalText;
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        console.warn('Clipboard copy failed:', err);
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & MODAL
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('portfolio-contact-form');
  const contactDialog = document.getElementById('contact-dialog');
  const modalUserName = document.getElementById('modal-user-name');
  const modalSubjectPreview = document.getElementById('modal-subject-preview');
  const modalMessagePreview = document.getElementById('modal-message-preview');
  const modalMailtoLink = document.getElementById('modal-mailto-link');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const validateField = (inputEl, condition) => {
    if (!inputEl) return false;
    const parentRow = inputEl.closest('.form-row');
    if (!condition) {
      if (parentRow) parentRow.classList.add('has-error');
      return false;
    } else {
      if (parentRow) parentRow.classList.remove('has-error');
      return true;
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const isNameValid = validateField(nameInput, nameInput && nameInput.value.trim().length > 1);
      const isEmailValid = validateField(emailInput, emailInput && emailRegex.test(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput && subjectInput.value !== '');
      const isMessageValid = validateField(messageInput, messageInput && messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = messageInput.value.trim();

        if (modalUserName) modalUserName.textContent = name;
        if (modalSubjectPreview) modalSubjectPreview.textContent = subject;
        if (modalMessagePreview) modalMessagePreview.textContent = message;

        const targetEmail = 'adhuzcom1@gmail.com';
        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - ${name}`);
        const mailtoBody = encodeURIComponent(
          `Hello Adhil,\n\nName: ${name}\nEmail: ${email}\nInquiry Topic: ${subject}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
        );

        if (modalMailtoLink) {
          modalMailtoLink.setAttribute('href', `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`);
        }

        if (contactDialog) {
          if (typeof contactDialog.showModal === 'function') {
            contactDialog.showModal();
          } else {
            contactDialog.setAttribute('open', '');
          }
        }
      }
    });

    // Clear validation error on input
    ['form-name', 'form-email', 'form-subject', 'form-message'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const row = el.closest('.form-row');
          if (row) row.classList.remove('has-error');
        });
      }
    });
  }

  if (modalCloseBtn && contactDialog) {
    modalCloseBtn.addEventListener('click', () => {
      if (typeof contactDialog.close === 'function') {
        contactDialog.close();
      } else {
        contactDialog.removeAttribute('open');
      }
    });
  }

  if (modalCopyBtn && modalMessagePreview) {
    modalCopyBtn.addEventListener('click', async () => {
      const fullText = `Subject: ${modalSubjectPreview ? modalSubjectPreview.textContent : ''}\n\n${modalMessagePreview.textContent}`;
      try {
        await navigator.clipboard.writeText(fullText);
        const originalText = modalCopyBtn.textContent;
        modalCopyBtn.textContent = 'Copied!';
        setTimeout(() => {
          modalCopyBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.warn('Draft copy failed:', err);
      }
    });
  }

  // Close dialog on backdrop click
  if (contactDialog) {
    contactDialog.addEventListener('click', (e) => {
      const rect = contactDialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        if (typeof contactDialog.close === 'function') {
          contactDialog.close();
        } else {
          contactDialog.removeAttribute('open');
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. DYNAMIC YEAR & BACK TO TOP
     ------------------------------------------------------------------------ */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
