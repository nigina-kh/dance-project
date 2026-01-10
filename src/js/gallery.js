const API_URL = 'http://localhost:3000/gallery';
const ITEMS_PER_PAGE = 8;

let currentPage = 1;
let allData = [];
let filteredData = [];

const grid = document.querySelector('.gallery__grid');
const pagination = document.querySelector('.gallery__pagination');
const searchInput = document.querySelector('.gallery__search');
const filterButtons = document.querySelectorAll('.filter-btn');

// Fetch gallery data from API
async function fetchGalleryData() {
  try {
    grid.innerHTML = '<p class="gallery__loading">Loading gallery...</p>';
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch gallery data');

    const jsonData = await response.json();

    // json-server возвращает объект с ключами, например { "gallery": [...] }
    allData = Array.isArray(jsonData) ? jsonData : jsonData.gallery;
    filteredData = [...allData];

    renderPage(1);
  } catch (error) {
    grid.innerHTML = '<p class="gallery__error">Cannot load gallery. Please check API.</p>';
    console.error(error);
  }
}

// Render a specific page
function renderPage(page, data = filteredData) {
  currentPage = page;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  renderGallery(data.slice(start, end));
  renderPagination(data);
}

// Render gallery items
function renderGallery(items) {
  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = '<p class="gallery__empty">No items found</p>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery__item fade-in';

    const img = document.createElement('img');

    // Исправленный путь: json должен хранить путь относительно public папки
    img.src = item.image.startsWith('src/') ? item.image.replace('src/', '') : item.image;
    img.alt = item.title;
    img.className = 'gallery__image';
    img.loading = 'lazy';
    img.style.opacity = 0;
    img.onload = () => {
      img.style.transition = 'opacity 0.5s ease-in-out';
      img.style.opacity = 1;
    };

    const caption = document.createElement('span');
    caption.className = 'gallery__caption';
    caption.textContent = item.title;

    div.appendChild(img);
    div.appendChild(caption);
    grid.appendChild(div);
  });
}

// Render pagination buttons
function renderPagination(data = filteredData) {
  pagination.innerHTML = '';
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = currentPage <= 1;
  prevBtn.onclick = () => renderPage(currentPage - 1, data);
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => renderPage(i, data);
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.onclick = () => renderPage(currentPage + 1, data);
  pagination.appendChild(nextBtn);
}

// Filter and search
function applyFilterAndSearch() {
  const query = searchInput.value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter.toLowerCase();

  filteredData = allData.filter(item => {
    const matchFilter = activeFilter === 'all' ? true : item.title.toLowerCase().includes(activeFilter);
    const matchSearch = item.title.toLowerCase().includes(query);
    return matchFilter && matchSearch;
  });

  renderPage(1, filteredData);
}

// Event listeners
searchInput.addEventListener('input', applyFilterAndSearch);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilterAndSearch();
  });
});

document.addEventListener('DOMContentLoaded', fetchGalleryData);
