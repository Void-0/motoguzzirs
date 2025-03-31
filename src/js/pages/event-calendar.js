import '../../css/styles.scss';

document.addEventListener("DOMContentLoaded", () => {
  const calendarTitle = document.getElementById('calendar-title');
  const prevButton = document.getElementById('prev-month');
  const nextButton = document.getElementById('next-month');
  const cells = document.querySelectorAll('.calendar-table tbody td');
  let currentMonth = new Date(); // Initialize with the current date

  // Updates the content of the calendar
  function updateCalendar(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Update title with the current month and year
    const monthName = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    calendarTitle.textContent = monthName;

    // First and last days for the current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDateOfMonth = lastDayOfMonth.getDate();
    const firstWeekday = firstDayOfMonth.getDay() || 7; // Convert Sunday (0) to 7

    // Previous month's last day
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

    // Fill calendar cells
    let prevMonthStart = lastDayOfPrevMonth - (firstWeekday - 2); // Start from this day
    let day = 1;
    let nextMonthDay = 1;

    cells.forEach((cell, index) => {
      cell.className = ''; // Clear previous classes

      if (index < firstWeekday - 1) {
        // Fill in previous month's days
        cell.textContent = prevMonthStart++;
        cell.classList.add('prev-month');
      } else if (day > lastDateOfMonth) {
        // Fill in next month's days
        cell.textContent = nextMonthDay++;
        cell.classList.add('next-month');
      } else {
        // Fill in current month's days
        cell.textContent = day++;
        cell.classList.add('current-month');

        // Highlight today's date
        const today = new Date();
        if (
          year === today.getFullYear() &&
          month === today.getMonth() &&
          parseInt(cell.textContent, 10) === today.getDate()
        ) {
          cell.classList.add('today');
        }
      }
    });
  }

  // Event listeners for buttons
  prevButton.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1); // Go to previous month
    updateCalendar(currentMonth);
  });

  nextButton.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1); // Go to next month
    updateCalendar(currentMonth);
  });

  // Initial render
  updateCalendar(currentMonth);
});
