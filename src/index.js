import { GeoLocation, WeatherAPI } from './weatherApi';
import { CurrentConditions } from './currentConditions';
import './style.css';

const todaysWeather = new WeatherAPI();

todaysWeather
  .currentWeatherbyPos()
  .then((data) => console.log(data.current.temp_f));

window.customElements.define('current-conditions', CurrentConditions);
