// script.js
const container = document.getElementById('heatmap-container');
const prevYearButton = document.getElementById('prev-year');
const nextYearButton = document.getElementById('next-year');
const displayYearElement = document.getElementById('display-year');
const toggleThemeButton = document.getElementById('toggle-theme');

const maxLevel = 4;
const savedDataKey = (year) => `habitTrackerData-${year}`;
const lastClickDateKey = 'lastClickDate';
const themeKey = 'theme';

let currentYear = new Date().getFullYear(); // Default to current year
let today = new Date();

// Initialize theme
const currentTheme = localStorage.getItem(themeKey) || 'light';
document.body.classList.toggle('dark-mode', currentTheme === 'dark');

// Update theme button text
toggleThemeButton.textContent = currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

// Render heatmap for the given year
function renderHeatmap(year) {
  container.innerHTML = ''; // Clear previous heatmap
  displayYearElement.textContent = `Year: ${year}`;

  const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365; // Leap year check
  const savedData = JSON.parse(localStorage.getItem(savedDataKey(year))) || Array(daysInYear).fill(0);
  const currentDayOfYear = year === today.getFullYear()
    ? Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    : -1;

  for (let i = 0; i < daysInYear; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    day.dataset.level = savedData[i];
    day.dataset.date = new Date(year, 0, i + 1).toLocaleDateString();
    day.title = `Day ${i + 1}: Level ${savedData[i]}`;

    // Highlight the current day if in the current year
    if (i === currentDayOfYear - 1) {
      day.classList.add('current-day');
      setTimeout(() => {
        day.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }, 100);
    }

    day.addEventListener('click', () => {
      if (year === today.getFullYear() && localStorage.getItem(lastClickDateKey) === today.toISOString().slice(0, 10)) {
        alert('You can only update once per day!');
        return;
      }

      let currentLevel = parseInt(day.dataset.level, 10);
      let newLevel = (currentLevel + 1) % (maxLevel + 1);
      day.dataset.level = newLevel;
      day.title = `Day ${i + 1}: Level ${newLevel}`;

      savedData[i] = newLevel;
      localStorage.setItem(savedDataKey(year), JSON.stringify(savedData));

      if (year === today.getFullYear()) {
        localStorage.setItem(lastClickDateKey, today.toISOString().slice(0, 10));
      }
    });

    container.appendChild(day);
  }
}

// Year navigation controls
prevYearButton.addEventListener('click', () => {
  currentYear--;
  renderHeatmap(currentYear);
});

nextYearButton.addEventListener('click', () => {
  currentYear++;
  renderHeatmap(currentYear);
});

// Theme toggle functionality
toggleThemeButton.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  const newTheme = isDarkMode ? 'dark' : 'light';
  localStorage.setItem(themeKey, newTheme);

  toggleThemeButton.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Initial render
renderHeatmap(currentYear);
