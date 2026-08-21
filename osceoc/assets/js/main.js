/* O Consolador — interações do site */
(function () {
  'use strict';

  // header sólido ao rolar (na home o hero é escuro; nas internas já começa sólido)
  var header = document.getElementById('header');
  var hasHero = !!document.querySelector('.hero');
  function onScroll() {
    if (!header) return;
    var solid = !hasHero || window.scrollY > 40;
    header.classList.toggle('solid', solid);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // menu mobile
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      header.classList.add('solid');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // revelar ao rolar
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, Math.min(i * 70, 280));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // barra de progresso da campanha + contagem
  var bar = document.querySelector('.bar i');
  if (bar && 'IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var pct = parseFloat(bar.getAttribute('data-pct')) || 0;
        requestAnimationFrame(function () { bar.style.width = pct + '%'; });
        var n = document.querySelector('.nums b[data-count]');
        if (n) {
          var target = parseInt(n.getAttribute('data-count'), 10) || 0, cur = 0;
          n.textContent = '0';
          var step = Math.max(1, Math.round(target / 24));
          var t = setInterval(function () {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            n.textContent = cur;
          }, 45);
        }
        bo.disconnect();
      });
    }, { threshold: 0.4 });
    bo.observe(bar.closest('.meter') || bar);
  } else if (bar) {
    bar.style.width = (bar.getAttribute('data-pct') || 0) + '%';
  }

  // lightbox
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbBtn = lb.querySelector('button');
    document.querySelectorAll('[data-lb]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        var inner = a.querySelector('img');
        lbImg.alt = inner ? inner.alt : '';
        lb.classList.add('on');
        document.body.style.overflow = 'hidden';
      });
    });
    function close() {
      lb.classList.remove('on');
      document.body.style.overflow = '';
      lbImg.src = '';
    }
    lbBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('on')) close(); });
  }
})();

/* modo apresentação — oculta os marcadores de referência */
(function () {
  var KEY = 'osc-clean';
  var btn = document.createElement('button');
  btn.className = 'ref-toggle';
  btn.type = 'button';
  function paint() {
    var clean = document.body.classList.contains('clean');
    btn.innerHTML = '<span class="dot"></span>' + (clean ? 'Mostrar referências' : 'Modo apresentação');
    btn.setAttribute('aria-pressed', clean ? 'true' : 'false');
  }
  try { if (sessionStorage.getItem(KEY) === '1') document.body.classList.add('clean'); } catch (e) {}
  paint();
  btn.addEventListener('click', function () {
    var clean = document.body.classList.toggle('clean');
    try { sessionStorage.setItem(KEY, clean ? '1' : '0'); } catch (e) {}
    paint();
  });
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); });
  if (document.readyState !== 'loading') document.body.appendChild(btn);
})();


/* barras da composição de custo */
(function () {
  var bars = document.querySelectorAll('.cost-bar i');
  if (!bars.length) return;
  if (!('IntersectionObserver' in window)) {
    bars.forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var b = en.target, w = b.getAttribute('data-w');
      setTimeout(function () { b.style.width = w + '%'; }, 80);
      io.unobserve(b);
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) { io.observe(b); });
})();
