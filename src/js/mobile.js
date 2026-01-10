document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  const submenuItems = document.querySelectorAll('.nav__item--has-submenu > a');

  // Toggle main menu
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navList.classList.toggle('active');
  });

  // Toggle submenus on mobile
  submenuItems.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const submenu = link.nextElementSibling;
        submenu.classList.toggle('active');
      }
    });
  });

  // Reset menu on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navList.classList.remove('active');
      toggle.classList.remove('active');
      document.querySelectorAll('.nav__submenu').forEach(sm => sm.classList.remove('active'));
    }
  });
});
