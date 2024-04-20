import { GeoLocation, WeatherAPI } from './weatherApi';
import { CurrentConditions } from './currentConditions';
import { Dashboard } from './dashboard';
import { HourlyScroll } from './hourlyScroll';
import { DailyForecast } from './dailyForecast';
import { LocationSettings } from './locationSettings';
import './style.css';

window.customElements.define('current-conditions', CurrentConditions);
window.customElements.define('current-dashboard', Dashboard);
window.customElements.define('hourly-scroll', HourlyScroll);
window.customElements.define('daily-forecast', DailyForecast);
window.customElements.define('saved-locations', LocationSettings);

const viewMode = document.getElementById('mode');

viewMode.addEventListener('click', () => {
  if (viewMode.lastElementChild.textContent === 'Dark') {
    viewMode.firstElementChild.setAttribute('src', './images/sun.svg');
    viewMode.lastElementChild.textContent = 'Light';
    document.body.style.backgroundImage = 'url("./images/darkMode.jpg")';
    document.documentElement.style.setProperty(
      '--components-backgroundLight',
      'rgba(47, 53, 71, 0.75)',
    );
    document.documentElement.style.setProperty('--menu-color', '#3d414f');
    document.body.style.color = '#EEF2FB';
  } else {
    viewMode.firstElementChild.setAttribute('src', './images/moon.svg');
    viewMode.lastElementChild.textContent = 'Dark';
    document.body.style.backgroundImage = 'url("./images/lightMode.jpg")';
    document.documentElement.style.setProperty(
      '--components-backgroundLight',
      'rgba(255, 255, 255, 0.75)',
    );
    document.documentElement.style.setProperty('--menu-color', '#f8fafd');
    document.body.style.color = '#4f5867';
  }
});
