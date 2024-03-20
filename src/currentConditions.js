'use strict';
import { GeoLocation, WeatherAPI } from './weatherApi';
import { AutoComplete } from './autoComplete';
import { format, formatISO, getTime, parseISO, startOfHour } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { HourlyScroll } from './hourlyScroll';
import { DailyForecast } from './dailyForecast';
const currentWeatherTemplate = document.createElement('template');
currentWeatherTemplate.innerHTML = `
<style>
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
    width: clamp(1.5rem, 1.41759rem + 0.347vw, 2.25rem); /*image	380	24	PX	3840	36*/
    height: clamp(1.5rem, 1.41759rem + 0.347vw, 2.25rem); /*image	380	24	PX	3840	36*/
    background: url("./images/map-pin.svg") center / contain no-repeat;
    z-index:1;
  }
  .clearText {
    visibility: hidden;
    content: "";
    position: absolute;
    right: 50px;
    bottom: 0px;
    width: clamp(1.5rem, 1.41759rem + 0.347vw, 2.25rem); /*image	380	24	PX	3840	36*/
    height: clamp(1.5rem, 1.41759rem + 0.347vw, 2.25rem); /*image	380	24	PX	3840	36*/
    background: url("./images/x-circle-fill.svg") center / contain no-repeat;
    z-index:1;
  }
  .clearText:hover {
    cursor:pointer;
  }

  #search-location {
    position: relative; 
    width: 100%;
    /*width: clamp(
      12.375rem,
      9.51265rem + 12.052vw,
      38.4375rem
    );*/ /*p	380	198	PX	3840	615	PX*/
    height: clamp(3.125rem, 2.91909rem + 0.867vw, 5rem); /*height	380	50	PX	3840	129	PX*/
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-style: none;
    margin-top: clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem); /* margin	380	14	PX	3840	50	PX */
    outline:none;
    padding: 0 37px 0 64px;
    font-size: clamp(1.25rem, 1.14028rem + 0.462vw, 2.25rem); /*font-size	380	20	PX	3840	36*/
  }

  #search-location::placeholder {
    color: #000000;
  }

  #search-container{
    
  }

  #search-dropdown{
    position:absolute;
    background-color: rgba(0, 0, 0, 0.7);
    width:90%;
    height: 100px;
    margin-left:2%;
    border-radius: 10px;
    color: #ffffff;
    overflow-y: auto;
    visibility: hidden;
  }

  .dropdownValue {
    padding: 5px;
    font-size: clamp(1.25rem, 1.14028rem + 0.462vw, 2.25rem); /*font-size	380	20	PX	3840	36*/
  }

  .dropdownValue:hover{
    cursor:pointer;
    background-color:#858585b3;
  }
  .selected {
    background-color: #858585b3;
  }
  #nowText{
    margin-top: clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem);
  }
  .large {
    font-size: clamp(3.875rem, 2.92785rem + 3.988vw, 12.5rem); /*p	380	62	PX	3840	200	PX*/
    /*color: #ffffff;*/
    font-weight: 400;
  }
  
  .medium {
    font-size: clamp(1.5rem, 1.22545rem + 1.156vw, 4rem); /* p	380	24	PX	3840	64	PX */
    /*color: #ffffff;*/
    font-weight: 400;
  }
  
  .small {
    font-size: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem); /*p	380	14	PX	3840	36	PX*/
    /*color: #ffffff;*/
    font-weight: 400;
  }
  
  .currentWeatherContainer {
    position: absolute;
    
    margin-top: clamp(1rem, 0.08016rem + 3.873vw, 9.375rem);/* margin-top	380	16	PX	3840	150	PX */
    /*width	380	210	PX	3840	650	PX*/
    /*width: clamp(13.125rem, 10.10471rem + 12.717vw, 40.625rem);*/
    width: 85vw;
    margin: 0 clamp(1rem, -1.05936rem + 8.671vw, 19.75rem) 0 clamp(1rem, -1.05936rem + 8.671vw, 19.75rem);/* margin-left	380	16	PX	3840	316	PX */
  }
  
  .currentTemp {
    display: flex;
  }
  
  .currentTemp img {
    
    width: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem); /*image	380	62	PX	3840	210	PX*/
    height: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem);
  
    /* width: clamp(3.875rem, 3.61423rem + 1.098vw, 6.25rem);
    height: clamp(3.875rem, 3.61423rem + 1.098vw, 6.25rem); */
  }
  .loaderContainer {
    margin-top: clamp(4rem, 3.40958rem + 2.486vw, 9.375rem); /*margin-top	380	64	PX	3840	150	PX*/
    margin-left: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem)
  }
  .loader {
    /*color: #ffffff;*/
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
      position: relative; 
      width: 90vw;
      height: clamp(3.125rem, 2.58279rem + 2.283vw, 8.0625rem); /*height	380	50	PX	3840	129	PX*/
      border-radius: 50px;
      background-color: rgba(0, 0, 0, 0.5);
      border-style: none;
      margin-top: clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem);/* margin	380	14	PX	3840	50	PX */
      outline:none;
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
<div id="search-dropdown">
</div>
</div>
<p class="medium" id="nowText">Now</p>
<div class="loaderContainer">
<span class="loader"></span>
</div>
<div id="currentTempContainer">
<div class="currentTemp">
  <p class="large" temp=""></p>
  <img id="weatherIcon" src="" alt=""/>
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
    const metric = '&deg;C'; // celsius
    const mph = 'mph'; //miles per hour
    const kph = 'kph'; //kilometers
    //console.log(currentTemp);

    this.loaderContainer.style.display = 'none';
    this.currentTempContainer.style.display = 'block';
    currentTemp.setAttribute('temp', Math.round(data.current.temp_f));
    currentTemp.innerHTML = `${currentTemp.getAttribute('temp')}${imperial}`;
    weatherIcon.setAttribute('src', `http:${data.current.condition.icon}`);
    weatherText.setAttribute('text', data.current.condition.text);
    weatherText.textContent = `${weatherText.getAttribute('text')}`;
    feelsLike.setAttribute('feelsLike', Math.round(data.current.feelslike_f));
    feelsLike.innerHTML = `${feelsLike.getAttribute('feelsLike')}${imperial}`;
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

  locationLookup(value) {
    if (!this.locationInput.value) {
      this.fetchDataUpdateUI();
      //return this.render(); //If no value exists, it will use Geolocation API or default to New York, New York if denied
    } else {
      this.fetchDataUpdateUI(value);
      //return this.render(value); //If a value exists it will pass the value to the render function
    }
  }

  // createDropdownList() {
  //   //Allows user to click the value in dropdown
  //   this.locationInput.addEventListener('input', (e) => {
  //     this.clearLocationInputValue(e.target.value); //Reveals button to clear text when input detected
  //     if (!e.target.value) {
  //       this.dropdownList.style.visibility = 'hidden';
  //     } else {
  //       todaysWeather.autoCompleteList(e.target.value).then((data) => {
  //         this.dropdownList.innerHTML = '';
  //         if (data.length > 0) {
  //           this.dropdownList.style.visibility = 'visible';
  //           data.forEach((value) => {
  //             // console.log(value);
  //             // console.log(value.name, value.region, value.country);
  //             const specificLocation = document.createElement('div');
  //             specificLocation.classList.add('dropdownValue');
  //             specificLocation.setAttribute('name', value.name);
  //             specificLocation.setAttribute('region', value.region);
  //             specificLocation.innerHTML = `${value.name}, ${value.region}, ${value.country}`;
  //             this.dropdownList.appendChild(specificLocation);
  //             //Event listener for clicking the location in the dropdown
  //             this.selectLocationByClick(
  //               specificLocation,
  //               value.name,
  //               value.region,
  //             );
  //           });
  //         } else {
  //           this.dropdownList.style.visibility = 'hidden';
  //         }
  //         // console.log(data);
  //       });
  //     }
  //     // console.log(e.target.value);
  //   });
  // }

  // selectLocationByClick(div, name, region) {
  //   div.addEventListener('click', (e) => {
  //     this.dropdownList.style.visibility = 'hidden';
  //     this.locationInput.value = `${name}, ${region}`;
  //     this.render(this.locationInput.value);
  //   });
  // }

  // selectLocationsByKeydown() {
  //   //Allows use of keyboard to select location values
  //   let index = -1;
  //   let prevIndex;

  //   this.locationInput.addEventListener('keydown', (e) => {
  //     const allLocationValues =
  //       this.shadowRoot.querySelectorAll('.dropdownValue');
  //     if (allLocationValues.length <= 0) {
  //       return;
  //     }
  //     //Traverses location list up
  //     if (e.key === 'ArrowUp') {
  //       e.preventDefault();
  //       reverseListSelection();
  //       this.shadowRoot.querySelector('.selected').scrollIntoView();
  //     } else if (e.shiftKey) {
  //       //Traverses location list up using shift + tab
  //       e.preventDefault();
  //       if (e.key === 'Tab') {
  //         reverseListSelection();
  //         this.shadowRoot.querySelector('.selected').scrollIntoView();
  //       }
  //     } else if (e.key === 'Tab' || e.key === 'ArrowDown') {
  //       //Traverses location list down
  //       e.preventDefault();
  //       index++;
  //       prevIndex = index - 1;
  //       if (index > allLocationValues.length - 1) {
  //         index = 0;
  //         prevIndex = allLocationValues.length - 1;
  //       }
  //       allLocationValues[index].classList.add('selected');
  //       if (prevIndex >= 0 && allLocationValues.length > 1) {
  //         allLocationValues[prevIndex].classList.remove('selected');
  //         console.log(allLocationValues.length);
  //       }

  //       this.shadowRoot.querySelector('.selected').scrollIntoView();
  //     } else if (e.key === 'Enter') {
  //       let indexValue = '';
  //       if (allLocationValues[index]) {
  //         indexValue = `${allLocationValues[index].getAttribute('name')}, ${allLocationValues[index].getAttribute('region')}`;
  //       } else {
  //         indexValue = `${allLocationValues[0].getAttribute('name')}, ${allLocationValues[0].getAttribute('region')}`;
  //       }
  //       this.locationInput.value = indexValue;
  //       this.dropdownList.style.visibility = 'hidden';
  //       return this.locationLookup(indexValue);
  //     } else {
  //       index = -1;
  //     }

  //     function reverseListSelection() {
  //       if (index === -1) {
  //         // console.log(index - 1);
  //         index++;
  //         console.log(index);
  //       }
  //       index--;
  //       prevIndex = index + 1;
  //       if (index < 0) {
  //         index = allLocationValues.length - 1;
  //       }
  //       allLocationValues[index].classList.add('selected');
  //       console.log(prevIndex);
  //       // allLocationValues[prevIndex].classList.remove('selected');
  //       if (prevIndex >= 0 && allLocationValues.length > 1) {
  //         allLocationValues[prevIndex].classList.remove('selected');
  //       }
  //     }
  //   });

  //   // console.log(length);
  // }

  // clearLocationInputValue(e) {
  //   const clearIcon = this.shadowRoot.querySelector('.clearText');
  //   if (!e) {
  //     clearIcon.style.visibility = 'hidden';
  //   } else {
  //     clearIcon.style.visibility = 'visible';
  //   }
  //   clearIcon.addEventListener('click', (e) => {
  //     this.locationInput.value = '';
  //     clearIcon.style.visibility = 'hidden';
  //   });
  // }

  getGeolocationMapPin() {
    const mapPin = this.shadowRoot.querySelector('.pin');
    mapPin.addEventListener('click', () => {
      this.locationInput.value = '';
      this.locationLookup();
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

    const dayOne = obj.forecast.forecastday[0].hour;
    const dayTwo = obj.forecast.forecastday[1].hour;
    const timeZone = obj.location.tz_id;
    console.log(timeZone);

    const twentyFourHrs = [...dayOne, ...dayTwo];
    container.innerHTML = '';
    for (let i = 0; i < twentyFourHrs.length; i++) {
      if (
        getTime(zonedTimeToUtc(parseISO(twentyFourHrs[i].time), timeZone)) <
        getTime(startOfHour(this.today))
      ) {
        continue;
      }
      const hour = document.createElement('div');
      hour.classList.add('hour');
      console.log();
      if (
        getTime(zonedTimeToUtc(parseISO(twentyFourHrs[i].time), timeZone)) ===
        getTime(startOfHour(this.today))
      ) {
        hour.innerHTML = `<p class="time">Now</p>`;
      } else {
        hour.innerHTML = `
        <p class="time">${format(parseISO(twentyFourHrs[i].time), 'ha')}</p>`;
      }
      hour.innerHTML += `
      <img style="width: 48px" src="http://${twentyFourHrs[i].condition.icon}" alt="">
      <p class="temp">${Math.round(twentyFourHrs[i].temp_f)}&deg;F</p>
    `;
      container.appendChild(hour);
    }
  }

  setDailyForecast(data) {
    const container = document.querySelector('.dailyContainer');
    const currentDayOfweek = format(this.today, 'EEEE');

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
        `${Math.round(data.forecast.forecastday[i].day.maxtemp_f)}/${Math.round(data.forecast.forecastday[i].day.mintemp_f)}&deg;F`,
      );
      maxMinTemp.innerHTML = maxMinTemp.getAttribute('maxMin');
      icon.setAttribute(
        'src',
        `http://${data.forecast.forecastday[0].day.condition.icon}`,
      );
    }
  }

  connectedCallback() {
    //browser calls this when element is added to the document
    this.autoComplete.selectLocationsByKeydown();
    // this.createDropdownList();
    this.autoComplete.createDrowpdownList();
    this.getGeolocationMapPin();
    this.locationLookup();
  }
}

export { CurrentConditions };
