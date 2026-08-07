/* ============================================================
   WEB DEL PROCESO CNG — app.js v1 (2026-08-06)
   1) Gate de password (patron sessionStorage de los dashboards)
   2) Toggle ES/EN por data-attributes (html[data-lang] + [data-i18n])
   3) Nav activa + utilidades (print abre <details>)
   Sin CDNs, sin dependencias: autocontenido.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. GATE DE PASSWORD ----------
     Mismo patron que los dashboards (sessionStorage, ofuscacion
     consciente de contenido interno — no es seguridad fuerte).
     Clave provisional: CNG2026  [VERIFICAR CON JOSE]              */
  var PW = 'CNG2026';
  var KEY = 'cng_proceso_auth';

  function buildGate() {
    document.body.classList.add('cng-locked');
    var g = document.createElement('div');
    g.id = 'cng-gate';
    g.innerHTML =
      '<div class="g-box">' +
      '<h1>CNG &middot; Proceso</h1>' +
      '<p data-i18n="es">Material interno del equipo. Ingresa la clave.</p>' +
      '<p data-i18n="en">Internal team material. Enter the password.</p>' +
      '<input id="cng-pw" type="password" autocomplete="off" />' +
      '<button id="cng-pw-btn" data-i18n="es">Entrar</button>' +
      '<button id="cng-pw-btn-en" data-i18n="en">Enter</button>' +
      '<div class="g-err" id="cng-pw-err"><span data-i18n="es">Clave incorrecta</span><span data-i18n="en">Wrong password</span></div>' +
      '</div>';
    document.body.appendChild(g);
    var tryPw = function () {
      if (document.getElementById('cng-pw').value === PW) {
        sessionStorage.setItem(KEY, '1');
        unlock();
      } else {
        document.getElementById('cng-pw-err').style.visibility = 'visible';
      }
    };
    document.getElementById('cng-pw-btn').addEventListener('click', tryPw);
    document.getElementById('cng-pw-btn-en').addEventListener('click', tryPw);
    document.getElementById('cng-pw').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === 'Return' || e.keyCode === 13) tryPw();
    });
    setTimeout(function () { var i = document.getElementById('cng-pw'); if (i) i.focus(); }, 60);
  }

  function unlock() {
    document.body.classList.remove('cng-locked');
    var g = document.getElementById('cng-gate');
    if (g) g.remove();
    document.dispatchEvent(new CustomEvent('cng:ready'));
  }

  /* ---------- 2. IDIOMA (ES/EN por data-attributes) ---------- */
  function getLang() {
    try { return localStorage.getItem('cng_lang') || 'es'; } catch (e) { return 'es'; }
  }
  function setLang(l) {
    document.documentElement.setAttribute('data-lang', l);
    try { localStorage.setItem('cng_lang', l); } catch (e) { /* privado */ }
    var b = document.getElementById('cng-lang-btn');
    if (b) b.textContent = (l === 'es') ? 'EN' : 'ES';
    document.dispatchEvent(new CustomEvent('cng:lang', { detail: l }));
  }
  window.cngLang = getLang;                 // paginas lo usan para textos generados por JS
  window.cngT = function (es, en) { return getLang() === 'es' ? es : en; };

  /* ---------- 3. INIT ---------- */
  function init() {
    setLang(getLang());

    // boton de idioma
    var b = document.getElementById('cng-lang-btn');
    if (b) b.addEventListener('click', function () {
      setLang(getLang() === 'es' ? 'en' : 'es');
    });

    // nav activa (por nombre de archivo)
    var here = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('header.site nav a').forEach(function (a) {
      if (a.getAttribute('href') === here) a.classList.add('active');
    });

    // print: abrir todos los <details> y restaurar despues
    var touched = [];
    window.addEventListener('beforeprint', function () {
      touched = [];
      document.querySelectorAll('details:not([open])').forEach(function (d) {
        d.setAttribute('open', ''); touched.push(d);
      });
    });
    window.addEventListener('afterprint', function () {
      touched.forEach(function (d) { d.removeAttribute('open'); });
      touched = [];
    });

    // gate
    if (sessionStorage.getItem(KEY) === '1') {
      document.dispatchEvent(new CustomEvent('cng:ready'));
    } else {
      buildGate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
