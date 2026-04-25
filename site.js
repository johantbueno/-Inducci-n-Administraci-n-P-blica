/**
 * INAP — Inducción a la Administración Pública
 * Script único para todas las páginas (menú, lectura, progreso, modales).
 */
(function () {
  'use strict';

  var PAGE_ORDER = ['index', 'unidad1', 'unidad2', 'unidad3', 'unidad4', 'ley4108', 'casos', 'glosario'];
  var STORAGE_KEY = 'inap-course-progress-v2';

  function getCurrentPage() {
    var path = window.location.pathname || '';
    var file = path.split('/').pop() || '';
    file = file.replace(/[#?].*$/, '');
    if (!file) file = 'index.html';
    if (file === 'index.html' || file === 'index') return 'index';
    if (file.indexOf('unidad1') === 0) return 'unidad1';
    if (file.indexOf('unidad2') === 0) return 'unidad2';
    if (file.indexOf('unidad3') === 0) return 'unidad3';
    if (file.indexOf('unidad4') === 0) return 'unidad4';
    if (file.indexOf('ley4108') === 0) return 'ley4108';
    if (file.indexOf('casos') === 0) return 'casos';
    if (file.indexOf('glosario') === 0) return 'glosario';
    return 'index';
  }

  function loadProgressData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { pagesVisited: [] };
      var data = JSON.parse(raw);
      if (!data.pagesVisited) data.pagesVisited = [];
      return data;
    } catch (e) {
      return { pagesVisited: [] };
    }
  }

  function saveProgressData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* private mode / quota */ }
  }

  function trackVisit() {
    var page = getCurrentPage();
    var data = loadProgressData();
    if (data.pagesVisited.indexOf(page) === -1) {
      data.pagesVisited.push(page);
      saveProgressData(data);
    }
  }

  function overallProgressPercent() {
    var data = loadProgressData();
    var n = data.pagesVisited.length;
    return Math.round((n / PAGE_ORDER.length) * 100);
  }

  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-button');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.setAttribute('aria-controls', 'mobile-menu');
    menu.setAttribute('role', 'navigation');
    btn.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
    btn.addEventListener('click', function () {
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
    });
  }

  function initScrollProgress() {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    function update() {
      var st = window.scrollY || document.documentElement.scrollTop;
      var dh = document.documentElement.scrollHeight - window.innerHeight;
      var pct = dh <= 0 ? 0 : Math.min(100, Math.max(0, (st / dh) * 100));
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      a.addEventListener('click', function (e) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function navigateToPageId(pageId) {
    if (pageId === 'index') {
      window.location.href = 'index.html';
    } else {
      window.location.href = pageId + '.html';
    }
  }

  function onKeydownNav(e) {
    if (!e.altKey) return;
    var page = getCurrentPage();
    var idx = PAGE_ORDER.indexOf(page);
    if (e.key === 'ArrowRight' && idx >= 0 && idx < PAGE_ORDER.length - 1) {
      e.preventDefault();
      navigateToPageId(PAGE_ORDER[idx + 1]);
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      navigateToPageId(PAGE_ORDER[idx - 1]);
    }
  }

  function initCaseModals() {
    document.querySelectorAll('.case-modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.case-modal.active').forEach(function (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  }

  window.openCase = function (caseId) {
    var modal = document.getElementById(caseId + '-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCase = function (caseId) {
    var modal = document.getElementById(caseId + '-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  window.startCourse = function () {
    window.location.href = 'unidad1.html';
  };

  window.navigateToUnit = function (unitId) {
    window.location.href = unitId + '.html';
  };

  window.showProgress = function () {
    var data = loadProgressData();
    var visited = data.pagesVisited || [];
    var pct = overallProgressPercent();
    var labels = {
      index: 'Inicio',
      unidad1: 'Unidad I',
      unidad2: 'Unidad II',
      unidad3: 'Unidad III',
      unidad4: 'Unidad IV',
      ley4108: 'Ley 41-08',
      casos: 'Casos prácticos',
      glosario: 'Glosario'
    };
    var list = visited.map(function (id) { return labels[id] || id; }).join(', ') || '(aún ninguna)';
    window.alert(
      'Progreso del recorrido: ' + pct + '%\n' +
      'Secciones visitadas: ' + visited.length + ' de ' + PAGE_ORDER.length + '\n\n' +
      list
    );
  };

  document.addEventListener('keydown', onKeydownNav);

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function initGlosario() {
    var searchInput = document.getElementById('search-input');
    var alphabetFilter = document.getElementById('alphabet-filter');
    if (!searchInput || !alphabetFilter) return;

    var terms = document.querySelectorAll('.glossary-card');
    var currentFilter = 'all';

    function highlightTerm(termElement, searchTerm) {
      var title = termElement.querySelector('h3');
      var text = termElement.querySelector('p');
      var re = new RegExp('(' + escapeRegExp(searchTerm) + ')', 'gi');
      if (title && title.textContent.toLowerCase().indexOf(searchTerm) !== -1) {
        title.innerHTML = title.textContent.replace(re, '<span class="highlight">$1</span>');
      }
      if (text && text.textContent.toLowerCase().indexOf(searchTerm) !== -1) {
        text.innerHTML = text.textContent.replace(re, '<span class="highlight">$1</span>');
      }
    }

    function filterTerms(searchTerm, letterFilter) {
      terms.forEach(function (term) {
        var termText = term.dataset.term.toLowerCase();
        var termLetter = term.dataset.letter;
        var matchesSearch = !searchTerm || termText.indexOf(searchTerm) !== -1;
        var matchesLetter = letterFilter === 'all' || termLetter === letterFilter;
        if (matchesSearch && matchesLetter) {
          term.style.display = 'block';
          if (searchTerm) highlightTerm(term, searchTerm);
        } else {
          term.style.display = 'none';
        }
      });
    }

    searchInput.addEventListener('input', function (e) {
      filterTerms(e.target.value.toLowerCase(), currentFilter);
    });

    alphabetFilter.addEventListener('click', function (e) {
      if (!e.target.classList.contains('alphabet-letter')) return;
      alphabetFilter.querySelectorAll('.alphabet-letter').forEach(function (letter) {
        letter.classList.remove('active');
      });
      e.target.classList.add('active');
      currentFilter = e.target.dataset.letter;
      filterTerms(searchInput.value.toLowerCase(), currentFilter);
    });
  }

  /* ── Scroll Spy: resalta el enlace del sidebar según sección visible ── */
  function initScrollSpy() {
    var sections = document.querySelectorAll('main section[id]');
    var sidebarLinks = document.querySelectorAll('.sticky a[href^="#"]');
    if (!sections.length || !sidebarLinks.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sidebarLinks.forEach(function (l) { l.classList.remove('scroll-spy-active'); });
        var active = document.querySelector('.sticky a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('scroll-spy-active');
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ── Progreso por sección: marca ✓ en sidebar al leer ── */
  function initSectionProgress() {
    var sections = document.querySelectorAll('main section[id]');
    if (!sections.length) return;
    var page = getCurrentPage();
    var SKEY = 'inap-read-sections-v1';
    function getRead() {
      try { var r = localStorage.getItem(SKEY); return r ? JSON.parse(r) : {}; } catch(e) { return {}; }
    }
    function markBadge(id) {
      var link = document.querySelector('.sticky a[href="#' + id + '"]');
      if (link && !link.querySelector('.section-read-badge')) {
        var b = document.createElement('span');
        b.className = 'section-read-badge';
        b.title = 'Sección leída';
        b.textContent = '✓';
        link.appendChild(b);
      }
    }
    function saveRead(id) {
      var data = getRead();
      if (!data[page]) data[page] = [];
      if (data[page].indexOf(id) === -1) {
        data[page].push(id);
        try { localStorage.setItem(SKEY, JSON.stringify(data)); } catch(e) {}
      }
      markBadge(id);
    }
    var already = getRead();
    if (already[page]) already[page].forEach(markBadge);
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) saveRead(e.target.id);
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ── Quiz / Autoevaluación ── */
  function initQuiz() {
    /* Selección de opciones por pregunta */
    document.querySelectorAll('.quiz-question').forEach(function (q) {
      q.querySelectorAll('.quiz-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (q.dataset.answered) return;
          q.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('quiz-selected'); });
          opt.classList.add('quiz-selected');
        });
      });
    });

    /* Botón "Ver mi resultado" */
    document.querySelectorAll('.assessment-section').forEach(function (section) {
      var btn = section.querySelector('.quiz-submit');
      var resultDiv = section.querySelector('.quiz-result');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var questions = section.querySelectorAll('.quiz-question');
        var score = 0;
        var allAnswered = true;
        questions.forEach(function (q) {
          var sel = q.querySelector('.quiz-option.quiz-selected');
          if (!sel) { allAnswered = false; return; }
          q.dataset.answered = '1';
          q.querySelectorAll('.quiz-option').forEach(function (o) {
            o.style.pointerEvents = 'none';
            if (o.dataset.correct === 'true') o.classList.add('quiz-correct');
          });
          if (sel.dataset.correct === 'true') { score++; }
          else { sel.classList.add('quiz-incorrect'); }
        });
        if (!allAnswered && resultDiv) {
          resultDiv.style.display = 'block';
          resultDiv.className = 'quiz-result quiz-result-warning';
          resultDiv.textContent = '⚠ Responde todas las preguntas antes de ver el resultado.';
          return;
        }
        if (!allAnswered) return;
        btn.style.display = 'none';
        if (resultDiv) {
          var total = questions.length;
          var pct = Math.round((score / total) * 100);
          var cls = pct >= 80 ? 'quiz-result-excellent' : pct >= 60 ? 'quiz-result-good' : 'quiz-result-review';
          resultDiv.className = 'quiz-result ' + cls;
          var emoji = pct >= 80 ? '🏆' : pct >= 60 ? '✅' : '📚';
          var msg = pct >= 80
            ? ' Excelente: ' + score + '/' + total + ' correctas (' + pct + '%). ¡Dominas el contenido!'
            : pct >= 60
              ? ' Aprobado: ' + score + '/' + total + ' correctas (' + pct + '%). Repasa las incorrectas.'
              : ' Para reforzar: ' + score + '/' + total + ' correctas (' + pct + '%). Te recomendamos releer la unidad.';
          resultDiv.textContent = emoji + msg;
          resultDiv.style.display = 'block';
        }
      });
    });
  }

  function initDarkMode() {
    var DARK_KEY = 'inap-dark-mode';
    var toggle = document.getElementById('dark-mode-toggle');
    var icon = document.getElementById('dark-mode-icon');

    function applyDark(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
      } else {
        document.documentElement.classList.remove('dark');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
      }
    }

    /* Sync icon with current state (class already applied by inline script) */
    applyDark(document.documentElement.classList.contains('dark'));

    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.contains('dark');
      applyDark(!isDark);
      try { localStorage.setItem(DARK_KEY, (!isDark).toString()); } catch (e) {}
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    trackVisit();
    initMobileMenu();
    initScrollProgress();
    initSmoothAnchors();
    initCaseModals();
    initGlosario();
    initScrollSpy();
    initSectionProgress();
    initQuiz();
    initDarkMode();
  });
})();
