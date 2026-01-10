const API_BASE = "http://127.0.0.1:5000/api";


async function fetchPrograms() {
  const res = await fetch(`${API_BASE}/programs`);
  return res.json();
}

async function enroll(programId, email, date) {
  const res = await fetch(`${API_BASE}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programId, email, date })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
}

async function fetchCalendar() {
  const res = await fetch(`${API_BASE}/calendar`);
  return res.json();
}


document.addEventListener('DOMContentLoaded', () => {

  const calendarGrid = document.getElementById('calendarGrid');
  const monthYear = document.getElementById('monthYear');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function toLocalDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  async function updateProductButtons() {
    const cards = document.querySelectorAll('.product-card');
    const programs = await fetchPrograms();

    cards.forEach(card => {
      const id = card.dataset.id;
      const program = programs.find(p => p.id === id);
      if (!program) return;

      card.querySelector('.free-seats').textContent = program.freeSeats;

      const btn = card.querySelector('.product-card__btn');
      btn.disabled = program.freeSeats === 0;
      btn.style.opacity = program.freeSeats === 0 ? 0.6 : 1;

      card.querySelector('.product-card__form')?.remove();

      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';

      btn.addEventListener('click', () => {
        if (btn.disabled) return;

        const form = document.createElement('form');
        form.className = 'product-card__form';
        form.innerHTML = `
          <input type="email" placeholder="Your email" required />
          <input type="date" required />
          <button type="submit">Confirm</button>
        `;
        card.appendChild(form);

        form.addEventListener('submit', async e => {
          e.preventDefault();

          const email = form.querySelector('[type="email"]').value.trim();
          const date = form.querySelector('[type="date"]').value;

          if (!isValidEmail(email)) {
            alert('Invalid email');
            return;
          }

          try {
            await enroll(id, email, date);
            alert("Successfully enrolled!");
            await updateProductButtons();
            await renderCalendar(currentMonth, currentYear);
          } catch (err) {
            alert(err.message);
          }
        });
      });
    });
  }

  

  async function renderCalendar(month, year) {
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';
    const enrollments = await fetchCalendar();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = new Date(year, month).toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    for (let i = 0; i < firstDay; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar__day';

      const dateObj = new Date(year, month, day);
      const dateStr = toLocalDateString(dateObj);

      if (dateStr === toLocalDateString(today)) {
        dayEl.classList.add('calendar__today');
      }

      const num = document.createElement('div');
      num.className = 'calendar__date';
      num.textContent = day;
      dayEl.appendChild(num);

      enrollments.forEach(item => {
        if (item.date === dateStr) {
          const classEl = document.createElement('div');
          classEl.className = 'calendar__class';
          classEl.textContent = `${item.programId.replace(/-/g, ' ')} (${item.email})`;
          dayEl.appendChild(classEl);
        }
      });

      calendarGrid.appendChild(dayEl);
    }
  }


  prevMonthBtn?.addEventListener('click', async () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    await renderCalendar(currentMonth, currentYear);
  });

  nextMonthBtn?.addEventListener('click', async () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    await renderCalendar(currentMonth, currentYear);
  });

 
  updateProductButtons();
  renderCalendar(currentMonth, currentYear);
});
