/**
 * @jest-environment jsdom
 */

describe('Navigation toggle and submenu', () => {
  let toggle, navList, submenuLink, submenu;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <button class="nav__toggle"></button>
      <ul class="nav__list">
        <li class="nav__item nav__item--has-submenu">
          <a href="#" class="nav__link">Menu</a>
          <ul class="nav__submenu"></ul>
        </li>
      </ul>
    `;

    toggle = document.querySelector('.nav__toggle');
    navList = document.querySelector('.nav__list');
    submenuLink = document.querySelector('.nav__item--has-submenu > .nav__link');
    submenu = document.querySelector('.nav__submenu');

    // Simulate your DOMContentLoaded code
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navList.classList.toggle('active');
    });

    submenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      submenu.classList.toggle('active');
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navList.classList.remove('active');
        toggle.classList.remove('active');
        document.querySelectorAll('.nav__submenu').forEach(sm => sm.classList.remove('active'));
      }
    });
  });

  test('Clicking toggle button activates nav', () => {
    expect(toggle.classList.contains('active')).toBe(false);
    expect(navList.classList.contains('active')).toBe(false);

    toggle.click();

    expect(toggle.classList.contains('active')).toBe(true);
    expect(navList.classList.contains('active')).toBe(true);

    toggle.click();

    expect(toggle.classList.contains('active')).toBe(false);
    expect(navList.classList.contains('active')).toBe(false);
  });

  test('Clicking submenu link toggles submenu', () => {
    expect(submenu.classList.contains('active')).toBe(false);

    submenuLink.click();
    expect(submenu.classList.contains('active')).toBe(true);

    submenuLink.click();
    expect(submenu.classList.contains('active')).toBe(false);
  });

  test('Resizing window > 768 removes active classes', () => {
    // Activate classes first
    toggle.classList.add('active');
    navList.classList.add('active');
    submenu.classList.add('active');

    // Resize
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));

    expect(toggle.classList.contains('active')).toBe(false);
    expect(navList.classList.contains('active')).toBe(false);
    expect(submenu.classList.contains('active')).toBe(false);
  });
});
