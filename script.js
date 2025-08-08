document.addEventListener('DOMContentLoaded', function() {
  // Highlight active navigation link
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (currentPage === linkHref) {
      link.classList.add('active');
    }
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Environment check warning
  if (typeof window.checkEnvironment === 'function') {
    window.checkEnvironment();
  }

  // Language switcher delegation (works if google translate is present)
  const languageSwitcher = document.getElementById('languageSwitcher');
  if (languageSwitcher) {
    languageSwitcher.addEventListener('change', function() {
      const selectedLanguage = this.value;
      if (typeof window.triggerGoogleTranslate === 'function') {
        window.triggerGoogleTranslate(selectedLanguage);
      }
    });

    if (window.location.hash.includes('googtrans')) {
      const match = window.location.hash.match(/googtrans\(en\|(.+)\)/);
      if (match && match[1]) {
        languageSwitcher.value = match[1];
      }
    }
  }

  if (typeof window.hideGoogleTranslateElements === 'function') {
    setTimeout(window.hideGoogleTranslateElements, 1500);
  }
});

// Provide Google Translate helpers globally if not already defined inline
(function ensureTranslateHelpers() {
  if (typeof window.isLocalHost === 'undefined') {
    window.isLocalHost = false;
  }

  if (typeof window.checkEnvironment !== 'function') {
    window.checkEnvironment = function checkEnvironment() {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      window.isLocalHost = protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
      const warn = document.getElementById('warningMessage');
      if (warn) {
        warn.style.display = window.isLocalHost ? 'block' : 'none';
      }
      return !window.isLocalHost;
    };
  }

  if (typeof window.googleTranslateElementInit !== 'function') {
    window.googleTranslateElementInit = function googleTranslateElementInit() {
      if (!window.checkEnvironment()) {
        return;
      }
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false
        }, 'google_translate_element');
        window.googleTranslateReady = true;
      } catch (e) {
        console.error('Error initializing Google Translate:', e);
      }
    };
  }

  if (typeof window.triggerGoogleTranslate !== 'function') {
    window.triggerGoogleTranslate = function triggerGoogleTranslate(languageCode) {
      if (window.isLocalHost) {
        alert('تنبيه: المترجم لا يعمل على الملفات المحلية. يرجى استضافة الموقع على خادم ويب أو استخدام Live Server في VS Code.');
        return false;
      }
      setTimeout(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = languageCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
        if (languageCode !== 'en') {
          window.location.hash = '#googtrans(en|' + languageCode + ')';
        } else {
          window.location.hash = '';
        }
        window.location.reload();
      }, 300);
      return true;
    };
  }

  if (typeof window.hideGoogleTranslateElements !== 'function') {
    window.hideGoogleTranslateElements = function hideGoogleTranslateElements() {
      const selectors = [
        '.goog-te-banner-frame',
        '.goog-te-ftab',
        '.goog-logo-link',
        '.goog-te-gadget',
        '.goog-te-gadget-simple',
        '.goog-te-menu-frame',
        '#goog-gt-tt',
        '.goog-te-spinner-pos',
        '.goog-te-ftab-float'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
          el.style.width = '0';
          el.style.position = 'absolute';
          el.style.top = '-9999px';
        });
      });
      document.body.style.top = '0';
      document.body.style.position = 'static';
    };
  }
})();