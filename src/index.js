import { CurrentConditions } from './components/currentConditions';
import { Dashboard } from './components/dashboard';
import { HourlyScroll } from './components/hourlyScroll';
import { DailyForecast } from './components/dailyForecast';
import { LocationSettings } from './components/locationSettings';
import { Menu } from './components/menu';
import './style.css';

window.customElements.define('current-conditions', CurrentConditions);
window.customElements.define('current-dashboard', Dashboard);
window.customElements.define('hourly-scroll', HourlyScroll);
window.customElements.define('daily-forecast', DailyForecast);
window.customElements.define('saved-locations', LocationSettings);
window.customElements.define('settings-menu', Menu);

function appTheme() {
  const menu = document.querySelector('settings-menu');
  menu.detectTheme();
}

//Settings menu behavior
function settingsMenuBehavior() {
  const settingsBtn = document.querySelector('.settingsContainer');
  const settingsMenu = document.querySelector('settings-menu');

  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('visible');
  });

  window.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('settings') ||
      e.target.classList.contains('settingsContainer') ||
      e.target === settingsMenu
    ) {
      return;
    }
    settingsMenu.classList.remove('visible');
  });
}
appTheme();
settingsMenuBehavior();
