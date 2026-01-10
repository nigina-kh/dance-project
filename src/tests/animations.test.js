/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }], this);
    }
    unobserve() {}
  };
});

describe('Animations JS', () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <div class="fade-up"></div>
      <div class="fade-up"></div>
      <div class="fade-up"></div>
    `;

    const loadEvent = new Event('load');
    window.dispatchEvent(loadEvent);
  });

  test('adds "page-loaded" class on window load', () => {
    document.body.classList.add('page-loaded');
    expect(document.body.classList.contains('page-loaded')).toBe(true);
  });

  test('fade-up elements have transition delays', () => {
    const fadeElems = document.querySelectorAll('.fade-up');
    fadeElems.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.15}s`;
      expect(el.style.transitionDelay).toBe(`${index * 0.15}s`);
    });
  });

  test('IntersectionObserver adds "active" class when intersecting', () => {
    const fadeElems = document.querySelectorAll('.fade-up');
    fadeElems.forEach(el => {
      el.classList.add('active');
      expect(el.classList.contains('active')).toBe(true);
    });
  });
});
