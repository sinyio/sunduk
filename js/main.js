(function () {
  var top = document.getElementById('top');
  var burger = top.querySelector('.burger');

  // Шапка: фон после прокрутки
  function onScroll() { top.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Мобильное меню
  function setMenu(open) {
    top.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!top.classList.contains('open')); });
  top.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // Появление блоков
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Лайтбокс для фото и страниц меню
  var box = document.querySelector('.lightbox');
  var boxImg = box.querySelector('img');
  var set = [];
  var index = 0;

  function show(i) {
    index = (i + set.length) % set.length;
    boxImg.src = set[index].src;
    boxImg.alt = set[index].alt;
  }
  document.querySelectorAll('[data-gallery]').forEach(function (group) {
    var imgs = Array.prototype.slice.call(group.querySelectorAll('img'));
    imgs.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function () {
        set = imgs;
        show(i);
        box.showModal();
      });
    });
  });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Видео загружается только по клику
  document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('playing')) return;
      var prev = document.querySelector('.reels .playing');
      if (prev) {
        prev.classList.remove('playing');
        prev.querySelector('iframe').remove();
      }
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.title = 'Видео из кафе Сундук';
      btn.classList.add('playing');
      btn.appendChild(frame);
      btn.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
