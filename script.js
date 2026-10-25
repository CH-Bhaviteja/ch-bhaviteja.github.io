(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const backTop = document.getElementById('back-top');

  // Theme choice is kept on this device only.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('bhaviteja-portfolio-theme'); } catch (_) {}
  if (savedTheme === 'light') root.classList.add('light');
  const updateThemeIcon = () => {
    const light = root.classList.contains('light');
    if (!themeToggle) return;
    themeToggle.textContent = light ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  };
  updateThemeIcon();
  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('light');
    try { localStorage.setItem('bhaviteja-portfolio-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (_) {}
    updateThemeIcon();
  });

  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('in-view'));

  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks?.querySelectorAll('a[href^="#"]').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const onScroll = () => backTop?.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Avoid an accidental broken live-demo link before the real URL is inserted.
  const demo = document.querySelector('[data-live-demo]');
  const demoNote = document.getElementById('demo-note');
  if (demo && demo.getAttribute('href') === 'STREAMLIT_APP_URL_HERE') {
    demo.addEventListener('click', event => {
      event.preventDefault();
      if (demoNote) demoNote.textContent = 'Add your exact Streamlit dashboard URL to index.html before publishing this button.';
      demoNote?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  } else if (demoNote) demoNote.hidden = true;
})();
