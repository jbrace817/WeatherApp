const currentWeatherTemplate = document.createElement('template');
currentWeatherTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #search-location {
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
    /* p	380	14	PX	3840	50	PX */
    margin: clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem) 0
      clamp(0.875rem, 0.628rem + 1.04vw, 3.125rem) 0;
  
    /* margin: 50px 0 50px 0; 4k desktop */
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
  
</style>
<div class="currentWeatherContainer">
<h1 class="medium">Good Morning</h1>
<input
  type="text"
  name="location"
  id="search-location"
  placeholder="Enter your City"
/>
<p class="medium">Now</p>
<div class="currentTemp">
  <p class="large">37&deg;F</p>
  
</div>

<div class="currentConditions">
  <p class="medium">Mist</p>
  <p class="small">Feels like: 35&deg;F</p>
  <p class="small">Wind: 8 mph</p>
</div>
</div>`;

class CurrentConditions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(currentWeatherTemplate.content.cloneNode(true));
  }
}

export { CurrentConditions };
