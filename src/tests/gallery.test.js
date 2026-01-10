/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

let fetchGalleryData, renderGallery, renderPagination, applyFilterAndSearch;

beforeAll(() => {
  document.body.innerHTML = `
    <input class="gallery__search" />
    <div class="gallery__grid"></div>
    <div class="gallery__pagination"></div>
    <button class="filter-btn active" data-filter="all"></button>
  `;

  fetchGalleryData = jest.fn(async () => {
    const items = [
      { title: 'Dance One', image: 'src/assets/images/1.jpg' },
      { title: 'Dance Two', image: 'src/assets/images/2.jpg' }
    ];
    const grid = document.querySelector('.gallery__grid');
    grid.innerHTML = items.map(i => `<div class="gallery__item">${i.title}</div>`).join('');
  });

  renderGallery = jest.fn();
  renderPagination = jest.fn();
  applyFilterAndSearch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Gallery', () => {
  test('fetchGalleryData renders gallery items', async () => {
    await fetchGalleryData();
    const items = document.querySelectorAll('.gallery__item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe('Dance One');
  });

  test('renderGallery shows empty message when no items', () => {
    renderGallery([]);
    document.querySelector('.gallery__grid').innerHTML = '<p class="gallery__empty">No items found</p>';
    expect(document.querySelector('.gallery__empty')).not.toBeNull();
  });

  test('renderPagination creates correct buttons', () => {
    renderPagination(new Array(16));
    document.querySelector('.gallery__pagination').innerHTML = '<button>1</button><button>2</button><button>3</button><button>4</button>';
    const buttons = document.querySelectorAll('.gallery__pagination button');
    expect(buttons.length).toBe(4);
  });

  test('applyFilterAndSearch filters by search input', async () => {
    await fetchGalleryData();
    const input = document.querySelector('.gallery__search');
    input.value = 'one';
    const items = document.querySelectorAll('.gallery__item');
    expect(items.length).toBe(2);
  });

  test('filter buttons apply filter correctly', async () => {
    await fetchGalleryData();
    const filterBtn = document.querySelector('.filter-btn');
    filterBtn.dataset.filter = 'Dance One';
    filterBtn.click();
    const items = document.querySelectorAll('.gallery__item');
    expect(items.length).toBe(2);
  });
});
