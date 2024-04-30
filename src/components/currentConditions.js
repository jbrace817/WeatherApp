'use strict';
import { GeoLocation, WeatherAPI } from '../appAPI/weatherApi';
import { AutoComplete } from '../appAPI/autoComplete';
import { format, formatISO, getTime, parseISO, startOfHour } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { HourlyScroll } from './hourlyScroll';
import { DailyForecast } from './dailyForecast';
import { AppStorage } from '../appAPI/appStorage';
const currentWeatherTemplate = document.createElement('template');
currentWeatherTemplate.innerHTML = `
<style>

:host{
  --input-bkgLight: rgba(255, 255, 255, 0.5);
  --dropdown-bkgLight: rgba(255, 255, 255, 0.90);
  
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  label {
    position: relative;
  }
  
  .pin {
    content: "";
    position: absolute;
    left: 16px;
    bottom: 0;
    width: var(--icon-width);
    height: var(--icon-width);
    background: url("./images/map-pin.svg") center / contain no-repeat;
    z-index:1;
  }
  .clearText {
    visibility: hidden;
    content: "";
    position: absolute;
    right: 50px;
    bottom: 0px;
    width: var(--icon-width);
    height: var(--icon-width);
    background: url("./images/x-circle-fill.svg") center / contain no-repeat;
    z-index:1;
  }
  .clearText:hover {
    cursor:pointer;
  }

  #search-location {
    position: relative; 
    width: 100%;
    height: var(--searchBar-height); /*height	380	50	PX	3840	129	PX*/
    border-radius: 50px;
    background-color: var(--components-backgroundLight);
    border-style: none;
    margin-top: var(--margin-top); 
    outline:none;
    padding: 0 37px 0 64px;
    font-size: var(--search-font); 
   color: inherit;
  }

  .dark #search-location{
    background-color: var(--input-bkgDark);
  }

  #search-location::placeholder {
    color: inherit;
  }


  #search-container{
    
  }

  #search-dropdown{
    position:absolute;
    background-color: var(--menu-color);
    width:90%;
    height: 100px;
    margin-left:2%;
    border-radius: 10px;
    color: inherit;
    overflow-y: auto;
    visibility: hidden;
    z-index: 3;
  }

  .dark #search-dropdown{
    background-color: var(--input-bkgDark);
  }

  .dropdownValue {
    padding: 5px;
    font-size: var(--search-font); 
  }

  .dropdownValue:hover{
    cursor:pointer;
    background-color:var(--hover-color);
    background-color:var(--hover-color);
  }
  .selected {
    background-color: var(--hover-color);
    background-color: var(--hover-color);
  }
  #nowText{
    margin-top: var(--margin-top);
    margin-top: var(--margin-top);
  }
  .large {
    font-size: var(--large-text);
    font-weight: 400;
  }
  
  .medium {
    font-size: var(--medium-text); 
    font-weight: 400;
  }
  
  .small {
    font-size: var(--small-text); 
    font-weight: 400;
  }
 
  .currentWeatherContainer {
    position: absolute;
    margin-top: clamp(1rem, 0.08016rem + 3.873vw, 9.375rem);/* margin-top	380	16	PX	3840	150	PX */
    width: 85vw;
    margin: 0 var(--margin-leftRight) 0 var(--margin-leftRight);
  }
  
  .currentTemp {
    display: flex;
  }
  
  .currentTemp img {
    width: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem); /*image	380	62	PX	3840	210	PX*/
    height: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem);
  }
  .loaderContainer {
    margin-top: clamp(4rem, 3.40958rem + 2.486vw, 9.375rem); /*margin-top	380	64	PX	3840	150	PX*/
    margin-left: var(--margin-leftRight)
  }
  .loader {
    font-size: clamp(1.875rem, 1.3601rem + 2.168vw, 6.5625rem); /*image	380	30	PX	3840	105	PX*/
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    transform: translateZ(0);
    animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
  }
  
  @keyframes mltShdSpin {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 
      0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 
      0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, 
      -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, 
      -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
       -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, 
       -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
       -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, 
       -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 
      0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  
  @keyframes round {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }

  @media (max-width: 991.98px) {
    #search-location { 
      width: 90vw;
      height: clamp(3.125rem, 2.58279rem + 2.283vw, 8.0625rem); /*height	380	50	PX	3840	129	PX*/
      padding: 0 80px 0 48px;
    }
  }
   
</style>
<div class="currentWeatherContainer">
<div id="search-container">
  <label>
    <span class="pin"></span>
    <input
      type="text"
      name="location"
      id="search-location"
      placeholder="Enter your City"
    />
    <span class="clearText"></span>
  </label>
  <div id="search-dropdown"></div>
</div>
<p class="medium" id="nowText">Now</p>
<div class="loaderContainer">
  <span class="loader"></span>
</div>
<div id="currentTempContainer">
  <div class="currentTemp">
    <p class="large" temp=""></p>
    <img id="weatherIcon" src="" alt="" />
  </div>

  <div class="currentConditions">
    <p class="medium" text="">Mist</p>
    <p class="small">Feels like: <span feelsLike=""></span></p>
    <p class="small">Wind: <span wind=""></span></p>
  </div>
</div>
</div>`;

const todaysWeather = new WeatherAPI(); //New object that is used to retrieve weather forecast

class CurrentConditions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(currentWeatherTemplate.content.cloneNode(true));
    this.locationInput = this.shadowRoot.getElementById('search-location'); //Text input for location lookup of temperature
    this.dropdownList = this.shadowRoot.getElementById('search-dropdown'); //retrieves <div> of location values
    this.clearIcon = this.shadowRoot.querySelector('.clearText');
    this.currentTempContainer = this.shadowRoot.getElementById(
      'currentTempContainer',
    );
    this.loaderContainer = this.shadowRoot.querySelector('.loaderContainer'); //loader appears before data is loaded
    this.storage = new AppStorage();
    this.today = new Date();
    this.autoComplete = new AutoComplete(this);
  }

  //fetches from weatherAPI.js and passes data to UI.
  async fetchDataUpdateUI(location = GeoLocation.latLong()) {
    try {
      this.currentTempContainer.style.display = 'none';
      this.loaderContainer.style.display = 'flex';
      const data = await todaysWeather.forecast(await location);
      console.log(data);
      this.render(data);
      this.setDashboardData(data);
      this.setHourlyData(data);
      this.setDailyForecast(data);
      new DailyForecast(data);
      return data;
    } catch (error) {
      console.error('Error fetching weather data: ' + error);
      //show error to user;
      throw new Error(error);
    }
  }

  //Renders data to UI
  render(data) {
    let currentTemp = this.shadowRoot.querySelector('[temp]');
    let weatherText = this.shadowRoot.querySelector('[text]');
    let feelsLike = this.shadowRoot.querySelector('[feelsLike]');
    let windSpeed = this.shadowRoot.querySelector('[wind]');
    let weatherIcon = this.shadowRoot.getElementById('weatherIcon');
    const imperial = '&deg;F'; //fahrenheit
    // const metric = '&deg;C'; // celsius
    const mph = 'mph'; //miles per hour
    // const kph = 'kph'; //kilometers
    console.log(currentTemp);

    this.loaderContainer.style.display = 'none';
    this.currentTempContainer.style.display = 'block';
    currentTemp.setAttribute(
      'temp',
      Math.round(data.current['temp_' + this.temperatureScale()[0]]),
    );
    currentTemp.innerHTML = `${currentTemp.getAttribute('temp')}${this.temperatureScale()[1]}`;
    weatherIcon.setAttribute('src', `https:${data.current.condition.icon}`);
    weatherIcon.setAttribute('alt', data.current.condition.text);
    weatherText.setAttribute('text', data.current.condition.text);
    weatherText.textContent = `${weatherText.getAttribute('text')}`;
    feelsLike.setAttribute(
      'feelsLike',
      Math.round(data.current['feelslike_' + this.temperatureScale()[0]]),
    );
    feelsLike.innerHTML = `${feelsLike.getAttribute('feelsLike')}${this.temperatureScale()[1]}`;
    windSpeed.setAttribute('wind', Math.round(data.current.wind_mph));
    windSpeed.innerHTML = `${windSpeed.getAttribute('wind')} ${mph}`;
    if (this.locationInput.value === '') {
      //if location is allowed using GeoLocaion API it will add the location to the text input. If denied, it will default to New York, New york
      this.locationInput.value = `${data.location.name}, ${data.location.region}`;
    }
    if (this.locationInput.value) {
      this.autoComplete.clearLocationInputValue(this.locationInput.value);
      // this.clearLocationInputValue(this.locationInput.value); //Reveals button to clear text loaded by geolocation api
    }
  }

  temperatureScale() {
    let tempScale = this.storage.getParse('tempScale') ?? ['f', '&deg;F'];
    return tempScale;
  }

  locationLookup(value) {
    if (value) {
      console.log(this.locationInput.value);
      this.fetchDataUpdateUI(value);
    } else {
      this.initialLoad();
    }
  }

  //loads favorite location from localStorge if one exists
  //loads favorite location from localStorge if one exists
  initialLoad() {
    window.addEventListener(
      'load',
      () => {
        //Keys for storage
        const favorite = 'favorite';
        console.log('ran');
        if (this.storage.getParse(favorite)) {
          this.fetchDataUpdateUI(this.storage.getParse(favorite));
        } else {
          this.fetchDataUpdateUI();
        }
      },
      { once: true },
    );
  }

  getGeolocationMapPin() {
    const mapPin = this.shadowRoot.querySelector('.pin');
    mapPin.addEventListener('click', () => {
      this.locationInput.value = '';
      this.fetchDataUpdateUI();
    });
  }

  setDashboardData(obj) {
    const dashboard = document
      .querySelector('current-dashboard')
      .shadowRoot.querySelectorAll('.data');
    console.log(dashboard);

    let rain = obj.forecast.forecastday[0].day.daily_chance_of_rain + '%';
    let sunrise = obj.forecast.forecastday[0].astro.sunrise;
    let sunset = obj.forecast.forecastday[0].astro.sunset;
    let humidity = obj.current.humidity + '%';
    let pressure = obj.current.pressure_in + ' inHg';
    let uv = obj.current.uv;

    let unitData = [rain, sunrise, humidity, uv, sunset, pressure];

    for (let i = 0; i < dashboard.length; i++) {
      dashboard[i].innerHTML = unitData[i];
    }
  }

  setHourlyData(obj) {
    const container = document
      .querySelector('hourly-scroll')
      .shadowRoot.querySelector('.allHours');
    container.scroll(0, 0);
    container.scroll(0, 0);
    const dayOne = obj.forecast.forecastday[0].hour;
    const dayTwo = obj.forecast.forecastday[1].hour;
    const timeZone = obj.location.tz_id;
    console.log(timeZone);

    const twentyFourHrs = [...dayOne, ...dayTwo];
    container.innerHTML = '';
    for (let i = 0; i < twentyFourHrs.length; i++) {
      if (
        //zonedTimeToUTC converts the users timezone to UTC time
        getTime(zonedTimeToUtc(parseISO(twentyFourHrs[i].time), timeZone)) <
        getTime(startOfHour(this.today))
      ) {
        //ignores time before the start of the hour on users computer
        continue;
      }
      const hour = document.createElement('div');
      hour.classList.add('hour');

      if (
        getTime(zonedTimeToUtc(parseISO(twentyFourHrs[i].time), timeZone)) ===
        getTime(startOfHour(this.today))
      ) {
        hour.innerHTML = `<p class="time">Now</p>`;
      } else {
        hour.innerHTML = `
        <p class="time">${format(parseISO(twentyFourHrs[i].time), 'ha')}</p>`; //'ha' is for hour and AM/PM
      }
      hour.innerHTML += `
      <img src="https://${twentyFourHrs[i].condition.icon}" alt="${twentyFourHrs[i].condition.text}">
      <p class="temp">${Math.round(twentyFourHrs[i]['temp_' + this.temperatureScale()[0]])}${this.temperatureScale()[1]}</p>
    `;
      container.appendChild(hour);
    }
  }

  setDailyForecast(data) {
    const container = document.querySelector('.dailyContainer');
    const currentDayOfweek = format(this.today, 'EEEE'); //EEEE is the full name of the day of the week

    for (let i = 0; i < container.children.length; i++) {
      let day = container.children[i].shadowRoot.querySelector('.dayOfWeek');
      let weatherDescription =
        container.children[i].shadowRoot.querySelector('.description');
      let maxMinTemp = container.children[i].shadowRoot.querySelector('.temp');
      let icon = container.children[i].shadowRoot.querySelector('.icon');
      let dateToDayOfWeek = format(
        parseISO(data.forecast.forecastday[i].date),
        'EEEE',
      );
      if (currentDayOfweek === dateToDayOfWeek) {
        day.setAttribute('day', 'Today');
        day.innerHTML = day.getAttribute('day');
      } else {
        day.setAttribute('day', dateToDayOfWeek);
        day.innerHTML = day.getAttribute('day');
      }
      weatherDescription.setAttribute(
        'description',
        data.forecast.forecastday[i].day.condition.text,
      );
      weatherDescription.innerHTML =
        weatherDescription.getAttribute('description');
      maxMinTemp.setAttribute(
        'maxMin',
        `${Math.round(data.forecast.forecastday[i].day['maxtemp_' + this.temperatureScale()[0]])}/${Math.round(data.forecast.forecastday[i].day['mintemp_' + this.temperatureScale()[0]])}${this.temperatureScale()[1]}`,
      );
      maxMinTemp.innerHTML = maxMinTemp.getAttribute('maxMin');
      icon.setAttribute(
        'src',
        `https://${data.forecast.forecastday[i].day.condition.icon}`,
      );
      icon.setAttribute('alt', data.forecast.forecastday[i].day.condition.text);
    }
  }

  connectedCallback() {
    //browser calls this when element is added to the document
    this.autoComplete.selectLocationsByKeydown();
    this.autoComplete.createDrowpdownList();
    this.getGeolocationMapPin();
    this.locationLookup();
  }
}

export { CurrentConditions };
