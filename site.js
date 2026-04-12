/**
 * INAP — Inducción a la Administración Pública
 * Script único para todas las páginas (menú, lectura, progreso, modales).
 */
(function () {
  'use strict';

  var PAGE_ORDER = ['index', 'unidad1', 'unidad2', 'unidad3', 'ley4108', 'casos', 'glosario'];
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

  document.addEventListener('DOMContentLoaded', function () {
    trackVisit();
    initMobileMenu();
    initScrollProgress();
    initSmoothAnchors();
    initCaseModals();
    initGlosario();
  });
})();
