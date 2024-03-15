'use strict';
require.context('./images', true, /\.svg$/); //add images to production mode in webpack

const suplementalDataTemplate = document.createElement('template');

suplementalDataTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

.dashWrapper {
    width: clamp(20.25rem, 14.78025rem + 24.31vw, 73.125rem);  /*width 360 324 PX	3840 1170*/
    height:clamp(10.875rem, 8.46975rem + 10.69vw, 34.125rem);  /*height	360	174	PX	3840	546	PX*/
    border-radius: 1.25rem;
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    margin-left: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem); /*margin-left	380	16	PX	3840	316	PX */
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr 1fr;
    padding: 2% 0 2% 0;
    justify-items: center;
    align-items: center;
}

.metric {
    display:flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    border: 1px solid rgba(201, 201, 201, 0.75);
    width: 80%;
    height: 90%;
    border-radius: 10px;
    font-size: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem); /*p	380	14	PX	3840	36	PX*/
  }

  .metric img {
    width: clamp(1.5rem, 1.37063rem + 0.575vw, 2.75rem); /*image	380	24	PX	3840	44	PX*/
    height: clamp(1.5rem, 1.37063rem + 0.575vw, 2.75rem);
  }

  .data {
    height: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem); /*height	380	14	PX	3840	36	PX*/
  }

@media (max-width: 991.98px) {
    .dashWrapper {
      width: 90vw;  
    }
}
</style>

<div class="dashWrapper">

</div>
`;

class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      suplementalDataTemplate.content.cloneNode(true),
    );
    this.dashWrapper = this.shadowRoot.querySelector('.dashWrapper');
  }

  render() {
    const obj = {
      PoP: ['rain.svg'],
      Sunrise: ['sunrise.svg'],
      Humidity: ['humidity.svg'],
      'UV Index': ['uvIndex.svg'],
      Sunset: ['sunset.svg'],
      Pressure: ['pressure.svg'],
    };

    for (const key in obj) {
      let metricContainer = document.createElement('div');
      metricContainer.classList.add('metric');
      metricContainer.innerHTML = `
            <p style="font-size: clamp(0.75rem, 0.6265rem + 0.52vw, 1.875rem); /*p	380	12	PX	3840	30*/">${key}</p>
            <img src="./images/${obj[key][0]}" alt="${key}"/>
            <p class="data"></p>
            `;
      this.dashWrapper.appendChild(metricContainer);
    }
  }

  connectedCallback() {
    this.render();
  }
}

export { Dashboard };
