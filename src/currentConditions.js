'use strict';
import { GeoLocation, WeatherAPI } from './weatherApi';
const currentWeatherTemplate = document.createElement('template');
currentWeatherTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #search-location {
    position: relative; 
    /* width: clamp(13rem, 10.1994rem + 11.792vw, 38.5rem);
    height: clamp(1.0625rem, 0.7262rem + 1.416vw, 5.125rem); */
    /* width: 615px; 4k
    height: 86px; 4k */
    width: clamp(
      12.375rem,
      9.51265rem + 12.052vw,
      38.4375rem
    ); /*p	380	198	PX	3840	615	PX*/
    height: clamp(1.875rem, 1.65531rem + 0.925vw, 3.875rem); /*p	380	30	PX	3840	62	PX*/
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-style: none;
    text-align: center;
    /* margin	380	14	PX	3840	50	PX */
    margin-top: clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem);
    outline:none;
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
    /*p	380	62	PX	3840	200	PX*/
    font-size: clamp(3.875rem, 2.92785rem + 3.988vw, 12.5rem);
    color: #ffffffc7;
    font-weight: 400;
  }
  
  .medium {
    /* p	380	24	PX	3840	64	PX */
    font-size: clamp(1.5rem, 1.22545rem + 1.156vw, 4rem);
    color: #ffffffc7;
    font-weight: 400;
  }
  
  .small {
    /*p	380	14	PX	3840	36	PX*/
    font-size: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem);
    color: #ffffffc7;
    font-weight: 400;
  }
  
  .currentWeatherContainer {
    position: absolute;
    /* margin-top	380	16	PX	3840	150	PX */
    margin-top: clamp(1rem, 0.08016rem + 3.873vw, 9.375rem);
    /* margin-left	380	16	PX	3840	316	PX */
    margin-left: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem);
    /*image	380	210	PX	3840	650	PX*/
    width: clamp(13.125rem, 10.10471rem + 12.717vw, 40.625rem);
    
  }
  
  .currentTemp {
    display: flex;
  }
  
  .currentTemp img {
    /*image	380	62	PX	3840	210	PX*/
    width: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem);
    height: clamp(3.875rem, 2.85921rem + 4.277vw, 13.125rem);
  
    /* width: clamp(3.875rem, 3.61423rem + 1.098vw, 6.25rem);
    height: clamp(3.875rem, 3.61423rem + 1.098vw, 6.25rem); */
  }
  .loaderContainer {
    margin-top: clamp(4rem, 3.40958rem + 2.486vw, 9.375rem); /*margin-top	380	64	PX	3840	150	PX*/
    justify-content: center;
    align-items: center
  }
  .loader {
    color: #ffffffc7;
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
   
</style>
<div class="currentWeatherContainer">
<h1 class="medium">Good Morning</h1>
<div id="search-container">
<input
  type="text"
  name="location"
  id="search-location"
  placeholder="Enter your City"
/>
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
  }

  //Renders data to UI
  async render(location = GeoLocation.latLong()) {
    let currentTemp = this.shadowRoot.querySelector('[temp]');
    let weatherText = this.shadowRoot.querySelector('[text]');
    let feelsLike = this.shadowRoot.querySelector('[feelsLike]');
    let windSpeed = this.shadowRoot.querySelector('[wind]');
    let weatherIcon = this.shadowRoot.getElementById('weatherIcon');
    const loaderContainer = this.shadowRoot.querySelector('.loaderContainer');
    const currentTempContainer = this.shadowRoot.getElementById(
      'currentTempContainer',
    );

    const imperial = '&deg;F'; //fahrenheit
    const metric = '&deg;C'; // celsius
    const mph = 'mph'; //miles per hour
    const kph = 'kph'; //kilometers
    //console.log(currentTemp);
    currentTempContainer.style.display = 'none';
    loaderContainer.style.display = 'flex';
    todaysWeather.forcast(await location).then((data) => {
      //console.log(data);
      loaderContainer.style.display = 'none';
      currentTempContainer.style.display = 'block';

      currentTemp.setAttribute('temp', Math.round(data.current.temp_f));
      currentTemp.innerHTML = `${currentTemp.getAttribute('temp')}${imperial}`;
      weatherIcon.setAttribute('src', data.current.condition.icon);
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
    });
  }

  async locationLookup(value) {
    if (!this.locationInput.value) {
      return this.render(); //If no value exists, it will use Geolocation API or default to New York, New York if denied
    }
    return this.render(value); //If a value exists it will pass the value to the render function
  }

  async selectLocationsByClick() {
    //Allows user to click the value in dropdown
    this.locationInput.addEventListener('input', (e) => {
      if (!e.target.value) {
        this.dropdownList.style.visibility = 'hidden';
      } else {
        todaysWeather.autoCompleteList(e.target.value).then((data) => {
          this.dropdownList.innerHTML = '';
          if (data.length > 0) {
            this.dropdownList.style.visibility = 'visible';
            data.forEach((value) => {
              // console.log(value);
              // console.log(value.name, value.region, value.country);
              const specificLocation = document.createElement('div');
              specificLocation.classList.add('dropdownValue');
              specificLocation.setAttribute('name', value.name);
              specificLocation.setAttribute('region', value.region);
              specificLocation.innerHTML = `${value.name}, ${value.region}, ${value.country}`;
              this.dropdownList.appendChild(specificLocation);
              specificLocation.addEventListener('click', (e) => {
                this.dropdownList.style.visibility = 'hidden';
                this.locationInput.value = `${value.name}, ${value.region}`;
                this.render(this.locationInput.value);
                // console.log(specificLocation.innerHTML);
              });
            });
          } else {
            this.dropdownList.style.visibility = 'hidden';
          }
          // console.log(data);
        });
      }
      // console.log(e.target.value);
    });
  }

  async selectLocationsByKeydown() {
    //Allows use of keyboard to select location values
    let index = -1;
    let prevIndex;

    this.locationInput.addEventListener('keydown', (e) => {
      const allLocationValues =
        this.shadowRoot.querySelectorAll('.dropdownValue');
      if (allLocationValues.length <= 0) {
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        reverseListSelection();
        this.shadowRoot.querySelector('.selected').scrollIntoView();
      } else if (e.shiftKey) {
        e.preventDefault();
        if (e.key === 'Tab') {
          reverseListSelection();
          this.shadowRoot.querySelector('.selected').scrollIntoView();
        }
      } else if (e.key === 'Tab' || e.key === 'ArrowDown') {
        e.preventDefault();
        index++;
        prevIndex = index - 1;
        if (index > allLocationValues.length - 1) {
          index = 0;
          prevIndex = allLocationValues.length - 1;
        }
        allLocationValues[index].classList.add('selected');
        if (prevIndex >= 0 && allLocationValues.length > 1) {
          allLocationValues[prevIndex].classList.remove('selected');
          console.log(allLocationValues.length);
        }

        this.shadowRoot.querySelector('.selected').scrollIntoView();
      } else if (e.key === 'Enter') {
        let indexValue = '';
        if (allLocationValues[index]) {
          indexValue = `${allLocationValues[index].getAttribute('name')}, ${allLocationValues[index].getAttribute('region')}`;
        } else {
          indexValue = `${allLocationValues[0].getAttribute('name')}, ${allLocationValues[0].getAttribute('region')}`;
        }
        this.locationInput.value = indexValue;
        this.dropdownList.style.visibility = 'hidden';
        return this.locationLookup(indexValue);
      } else {
        index = -1;
      }

      function reverseListSelection() {
        if (index === -1) {
          // console.log(index - 1);
          index++;
          console.log(index);
        }
        index--;
        prevIndex = index + 1;
        if (index < 0) {
          index = allLocationValues.length - 1;
        }
        allLocationValues[index].classList.add('selected');
        console.log(prevIndex);
        // allLocationValues[prevIndex].classList.remove('selected');
        if (prevIndex >= 0 && allLocationValues.length > 1) {
          allLocationValues[prevIndex].classList.remove('selected');
          console.log(allLocationValues.length);
        }
      }
    });

    // console.log(length);
  }

  connectedCallback() {
    //browser calls this when element is added to the document
    this.selectLocationsByKeydown();
    this.selectLocationsByClick();
    this.locationLookup();
    this.render();
  }
}

export { CurrentConditions };
