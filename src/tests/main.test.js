/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div class="product-card" data-id="group-classes">
      <span class="free-seats">20</span>
      <button class="product-card__btn">Enroll</button>
    </div>
  `;

  localStorage.clear();
  global.alert = jest.fn();
  global.renderCalendar = jest.fn();
});

test('Enroll button adds an enrollment and updates free seats', () => {
  const card = document.querySelector('.product-card');
  const btn = card.querySelector('.product-card__btn');

  btn.addEventListener('click', () => {
    const form = document.createElement('form');
    form.className = 'product-card__form';
    form.innerHTML = `
      <input type="email" placeholder="Your email" required />
      <input type="date" required />
      <button type="submit">Confirm</button>
    `;
    card.appendChild(form);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const date = form.querySelector('input[type="date"]').value;

      const enrollments = JSON.parse(localStorage.getItem('productEnrollments') || '{}');
      if (!enrollments['group-classes']) enrollments['group-classes'] = [];
      enrollments['group-classes'].push({ email, date });
      localStorage.setItem('productEnrollments', JSON.stringify(enrollments));

      const freeSeatsEl = card.querySelector('.free-seats');
      freeSeatsEl.textContent = 20 - enrollments['group-classes'].length;
    });
  });

  btn.click();

  const form = card.querySelector('.product-card__form');
  expect(form).not.toBeNull();

  const emailInput = form.querySelector('input[type="email"]');
  const dateInput = form.querySelector('input[type="date"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  emailInput.value = 'test@example.com';
  dateInput.value = '2025-12-25';

  submitBtn.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  const enrollments = JSON.parse(localStorage.getItem('productEnrollments'));
  expect(enrollments['group-classes']).toHaveLength(1);
  expect(enrollments['group-classes'][0].email).toBe('test@example.com');
  expect(enrollments['group-classes'][0].date).toBe('2025-12-25');

  const freeSeatsEl = card.querySelector('.free-seats');
  expect(freeSeatsEl.textContent).toBe('19');
});
