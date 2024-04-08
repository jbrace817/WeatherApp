import { GeoLocation, WeatherAPI } from './weatherApi';
import { CurrentConditions } from './currentConditions';
import { Dashboard } from './dashboard';
import { HourlyScroll } from './hourlyScroll';
import { DailyForecast } from './dailyForecast';
import { LocationSettings } from './locationSettings';
import './style.css';

// const todaysWeather = new WeatherAPI();

// todaysWeather
//   .currentWeatherbyPos()
//   .then((data) => console.log(data.current.temp_f));

window.customElements.define('current-conditions', CurrentConditions);
window.customElements.define('current-dashboard', Dashboard);
window.customElements.define('hourly-scroll', HourlyScroll);
window.customElements.define('daily-forecast', DailyForecast);
window.customElements.define('saved-locations', LocationSettings);
