import '../css/styles.scss';

document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcherMenu = document.getElementById('language-switcher-menu');
  const selectedLanguage = localStorage.getItem('language') || 'sr';

  // Populate the language switcher menu
  populateLanguageSwitcherMenu().then(() => {
    // Handle language selection
    languageSwitcherMenu.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('li');
      if (clickedItem) {
        const selectedLanguage = clickedItem.getAttribute('data-language');
        localStorage.setItem('language', selectedLanguage); // Save language preference
        updateContent(selectedLanguage);
      }
    });

    // Load initial language content
    updateContent(selectedLanguage);
  });

  /**
   * Function to dynamically populate the language switcher menu.
   */
  function populateLanguageSwitcherMenu() {
    return fetch('./assets/lang/langlist.json', { cache: 'no-store' }) // Fetch the list of language files from langlist.json
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load langlist.json');
      }
      return response.json();
    })
    .then((languageFiles) => {
      const languageMenuPromises = languageFiles.map((fileName) => {
        const languageCode = fileName.replace('.json', ''); // Language code (file minus extension)
        const iconPath = `./assets/icons/${languageCode}.png`;

        return fetch(`./assets/lang/${fileName}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          const menuItem = document.createElement('li');
          menuItem.setAttribute('data-language', languageCode);
          menuItem.innerHTML = `
                <a>
                  <img src="${iconPath}" alt="${languageCode}">
                  <span>${data.languageName}</span>
                </a>
              `;
          return menuItem; // Return the created menu item
        });
      });

      // Wait for all menu items to be created
      return Promise.all(languageMenuPromises);
    })
    .then((menuItems) => {
      menuItems.forEach((menuItem) => {
        if (menuItem) languageSwitcherMenu.appendChild(menuItem);
      });
    })
    .catch((error) => console.error('Error populating the language switcher menu:', error));
  }

  /**
   * Function to update the content dynamically based on the selected language.
   */
  function updateContent(language) {
    fetch(`./assets/lang/${language}.json`, { cache: 'no-store' }) // Fetch the selected language file
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load language file for ${language}`);
      }
      return response.json();
    }).then((languageData) => {
      // Update the language switcher with the language name and icon
      const switcherContainer = document.querySelector('#language-switcher');
      const switcherImg = switcherContainer.querySelector('img');
      const switcherSpan = document.querySelector('#language-switcher span');

      if (switcherSpan) {
        switcherSpan.textContent = languageData.languageName;
      } else {
        // If no <span> exists, create a new one and append it
        const newSwitcherSpan = document.createElement('span');
        newSwitcherSpan.textContent = languageData.languageName;
        switcherContainer.prepend(newSwitcherSpan);
      }

      if (switcherContainer) {
        if (switcherImg) {
          // If an <img> already exists, update its src and alt attributes
          switcherImg.src = `./assets/icons/${language}.png`;
          switcherImg.alt = languageData.languageName;
        } else {
          // If no <img> exists, create a new one and append it
          const newSwitcherImg = document.createElement('img');
          newSwitcherImg.src = `./assets/icons/${language}.png`;
          newSwitcherImg.alt = languageData.languageName;
          switcherContainer.prepend(newSwitcherImg);
        }
      }

      // Apply translations to matching elements
      Object.entries(languageData.translations).forEach(([ selector, text ]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          element.textContent = text;
        });
      });
    })
    .catch((error) => console.error('Error updating content:', error));
  }
});
