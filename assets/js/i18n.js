/**
 * Client-Side Multilingual Engine (Zero Reload)
 * Portfolio for Nguyen Huy Hoang
 */
(function () {
  'use strict';

  let statementHasIntersected = false;

  function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem('portfolio_lang');
      if (saved && (saved === 'en' || saved === 'vi')) {
        return saved;
      }
      if (navigator.language && navigator.language.toLowerCase().startsWith('vi')) {
        return 'vi';
      }
    } catch (e) {
      console.warn('Error reading language preference:', e);
    }
    return 'en';
  }

  function updateSwitcherUI(currentLang) {
    const switchers = document.querySelectorAll('.lang-switcher');
    switchers.forEach((switcher) => {
      const buttons = switcher.querySelectorAll('.lang-btn');
      buttons.forEach((btn) => {
        const target = btn.getAttribute('data-lang-target');
        const isActive = target === currentLang;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

        if (isActive) {
          btn.classList.add('bg-slate-900', 'text-white', 'shadow-sm', 'font-semibold');
          btn.classList.remove('text-slate-600', 'hover:text-slate-900', 'font-medium');
        } else {
          btn.classList.remove('bg-slate-900', 'text-white', 'shadow-sm', 'font-semibold');
          btn.classList.add('text-slate-600', 'hover:text-slate-900', 'font-medium');
        }
      });
    });
  }

  function refreshInkStatement(lang) {
    const statement = document.getElementById('ink-statement');
    if (!statement) return;

    const translations = window.TRANSLATIONS;
    const text = (translations && translations[lang] && translations[lang].philosophy && translations[lang].philosophy.statement)
      ? translations[lang].philosophy.statement
      : statement.textContent.trim();

    const words = text.trim().split(/\s+/);
    statement.textContent = '';

    const wordSpans = words.map((word) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = statementHasIntersected ? '1' : '0.35';
      span.style.transition = 'opacity 500ms ease';
      statement.appendChild(span);
      return span;
    });

    if (!statementHasIntersected && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (window._inkObserver) {
        window._inkObserver.disconnect();
      }
      window._inkObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statementHasIntersected = true;
            wordSpans.forEach((span, index) => {
              setTimeout(() => {
                span.style.opacity = '1';
              }, index * 40);
            });
            window._inkObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      window._inkObserver.observe(statement);
    } else if (statementHasIntersected) {
      wordSpans.forEach((span, index) => {
        span.style.opacity = '0.5';
        setTimeout(() => {
          span.style.opacity = '1';
        }, Math.min(index * 15, 300));
      });
    }
  }

  function applyLanguage(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) {
      console.warn(`Translation data for "${lang}" not found.`);
      return;
    }

    const dict = window.TRANSLATIONS[lang];

    // 1. Update Document HTML Attributes
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch (e) {
      console.warn('Unable to persist language choice to localStorage:', e);
    }

    // 2. Update Title and Meta
    const metaTitle = getNestedValue(dict, 'meta.title');
    if (metaTitle) {
      document.title = metaTitle;
    }

    const metaDesc = getNestedValue(dict, 'meta.description');
    if (metaDesc) {
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', metaDesc);
    }

    // 3. Update DOM Text Content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(dict, key);
      if (val !== undefined && val !== null) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 4. Update DOM Attributes (e.g. href, title, aria-label)
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach((rule) => {
        const parts = rule.split(':').map((s) => s.trim());
        if (parts.length === 2) {
          const [attr, key] = parts;
          const val = getNestedValue(dict, key);
          if (val !== undefined && val !== null) {
            el.setAttribute(attr, val);
          }
        }
      });
    });

    // 5. Update Switcher Buttons UI
    updateSwitcherUI(lang);

    // 6. Refresh Ink Statement
    refreshInkStatement(lang);
  }

  // Expose global switch method
  window.switchLanguage = function (lang) {
    applyLanguage(lang);
  };

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getSavedLanguage();

    // Bind click events on all language switcher buttons
    document.querySelectorAll('[data-lang-target]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang-target');
        if (targetLang) {
          applyLanguage(targetLang);
        }
      });
    });

    // Apply initial language
    applyLanguage(initialLang);
  });
})();
