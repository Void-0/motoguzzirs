import '../../css/styles.scss';

document.addEventListener("DOMContentLoaded", () => {
  const calendarTitle = document.getElementById('calendar-title');
  const prevButton = document.getElementById('prev-month');
  const nextButton = document.getElementById('next-month');
  const cells = document.querySelectorAll('.calendar-table tbody td');
  const eventContainer = document.getElementById('event-container');
  const eventTitle = document.getElementById('event-title');
  const eventThumbnail = document.getElementById('event-thumbnail');
  const eventFbVideo = document.getElementById('event-fb-video');
  const eventDescription = document.getElementById('event-description');
  const languageSwitcher = document.querySelector('.language-switcher-container ul li'); // Element with `data-language`

  let currentMonth = new Date(); // Initialize with the current date
  let currentLanguage = languageSwitcher.getAttribute('data-language') || 'en'; // Default language

  function updateEventContainer(event) {
    eventTitle.textContent = event.title || '';
    eventThumbnail.src = event.thumbnailUrl || '';
    eventThumbnail.alt = !!event.thumbnailUrl && event.title || '';
    eventDescription.innerHTML = event.body || '';
    if (event.fbVideo) {
      addFacebookVideoEmbed(event.fbVideo);
    } else {
      removeFacebookVideoEmbed();
    }
  }

  function loadEvents(dateString) {
    const filePath = `assets/events/${dateString}-${currentLanguage}.json`;
    return fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`No events found for ${dateString}-${currentLanguage}`);
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
    let eventDate;

    cells.forEach((cell, index) => {
      cell.innerHTML = '';
      cell.className = '';

      if (index < firstWeekday - 1) {
        // Fill in previous month's days
        eventDate = (new Date(year, month-1, prevMonthStart+1)).toISOString().split('T')[0];
        cell.innerHTML = `<span>${prevMonthStart++}</span>`;
        cell.classList.add('prev-month');
      } else if (day > lastDateOfMonth) {
        // Fill in next month's days
        eventDate = (new Date(year, month+1, nextMonthDay+1)).toISOString().split('T')[0];
        cell.innerHTML = `<span>${nextMonthDay++}</span>`;
        cell.classList.add('next-month');
      } else {
        eventDate = (new Date(year, month, day+1)).toISOString().split('T')[0];

        cell.classList.add('current-month');
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
          cell.classList.add('today');
        }

        cell.innerHTML = `<span>${day++}</span>`;
      }

      loadEvents(eventDate).then(events => {
        events.forEach(event => {
          const eventLink = document.createElement('a');
          eventLink.textContent = event.title;
          eventLink.href = '#';
          eventLink.addEventListener('click', (e) => {
            e.preventDefault();
            updateEventContainer(event);
          });
          cell.classList.add('has-event');
          cell.appendChild(eventLink);
        });
      });
    });
  }

  function addFacebookVideoEmbed(url) {
    if (!eventFbVideo) {
      console.error('Element with id #event-fb-video not found.');
      return;
    }

    // Add Facebook SDK script and video embed using innerHTML
    eventFbVideo.innerHTML = `
      <div class="fb-video"
        data-href="${url}"
        data-app-id="887156172104257"></div>
    `;

    // Trigger Facebook SDK to reparse the DOM
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse(eventFbVideo);
    } else {
      console.error('Facebook SDK not loaded. Ensure the SDK is initialized.');
    }
  }

  function removeFacebookVideoEmbed() {
    if (!eventFbVideo) {
      console.error('Element with id #event-fb-video not found.');
      return;
    }

    eventFbVideo.innerHTML = '';
  }


  // Observe changes to the `data-language` attribute
  const observer = new MutationObserver(() => {
    const newLanguage = languageSwitcher.getAttribute('data-language');
    if (newLanguage !== currentLanguage) {
      currentLanguage = newLanguage;
      updateCalendar(currentMonth); // Reload calendar with the new language
      updateEventContainer({});
    }
  });

  observer.observe(languageSwitcher, { attributes: true, attributeFilter: ['data-language'] });

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
