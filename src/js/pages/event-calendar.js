import '../../css/styles.scss';

document.addEventListener("DOMContentLoaded", () => {
  const calendarTitle = document.getElementById('calendar-title');
  const prevButton = document.getElementById('prev-month');
  const nextButton = document.getElementById('next-month');
  const cells = document.querySelectorAll('.calendar-table tbody td');
  const eventContainer = document.getElementById('event-container');
  const eventTitle = document.getElementById('event-title');
  const eventThumbnail = document.getElementById('event-thumbnail');
  const eventDescription = document.getElementById('event-description');

  let currentMonth = new Date(); // Initialize with the current date

  function updateEventContainer(event) {
    eventTitle.textContent = event.title;
    eventThumbnail.src = event.thumbnailUrl;
    eventThumbnail.alt = event.title;
    eventDescription.innerHTML = event.body;
  }

  function loadEvents(dateString) {
    return fetch(`assets/events/${dateString}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`No events found for ${dateString}`);
        }
        return response.json();
      })
      .catch(error => {
        console.warn(error.message);
        return [];
      });
  }

  function updateCalendar(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    // Update title with the current month and year
    const monthName = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    calendarTitle.textContent = monthName;

    // First and last days for the current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDateOfMonth = lastDayOfMonth.getDate();
    const firstWeekday = firstDayOfMonth.getDay() || 7;

    // Previous month's last day
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

    let prevMonthStart = lastDayOfPrevMonth - (firstWeekday - 2);
    let day = 1;
    let nextMonthDay = 1;

    cells.forEach((cell, index) => {
      cell.innerHTML = '';
      cell.className = '';

      if (index < firstWeekday - 1) {
        // Fill in previous month's days
        cell.textContent = prevMonthStart++;
        cell.classList.add('prev-month');
      } else if (day > lastDateOfMonth) {
        // Fill in next month's days
        cell.textContent = nextMonthDay++;
        cell.classList.add('next-month');
      } else {
        const cellDate = new Date(year, month, day);
        const dateString = cellDate.toISOString().split('T')[0];

        cell.classList.add('current-month');
        if (
          year === today.getFullYear() &&
          month === today.getMonth() &&
          day === today.getDate()
        ) {
          cell.classList.add('today');
        }

        cell.innerHTML = `<span>${day++}</span>`;

        loadEvents(dateString).then(events => {
          events.forEach(event => {
            const eventLink = document.createElement('a');
            eventLink.textContent = event.title;
            eventLink.href = '#';
            eventLink.addEventListener('click', (e) => {
              e.preventDefault();
              updateEventContainer(event);
            });
            cell.appendChild(eventLink);
          });
        });
      }
    });
  }

  // Event listeners for buttons
  prevButton.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    updateCalendar(currentMonth);
  });

  nextButton.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    updateCalendar(currentMonth);
  });

  // Initial render
  updateCalendar(currentMonth);
});
