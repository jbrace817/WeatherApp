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

const settingsBtn = document.querySelector('.settingsContainer');
settingsBtn.addEventListener('click', () => {
  const settingsModal = document.querySelector('saved-locations');
  settingsModal.style.visibility = 'visible';
  settingsModal.prefillLookup();
});
