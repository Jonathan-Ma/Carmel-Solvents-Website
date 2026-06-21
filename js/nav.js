/* CARMELSOLV™ — Mobile navigation toggle */
(function () {
  function init() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    if (!toggle) return;
    var links = nav.querySelector('.nav-links');

    function close() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after a link is tapped (mobile)
    if (links) {
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) close();
      });
    }

    // Reset state when returning to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 640) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
