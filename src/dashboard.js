'use strict';

import { CurrentConditions } from './currentConditions';

const suplementalDataTemplate = document.createElement('template');

suplementalDataTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

.cardWrapper {
    width: clamp(20.25rem, 14.78025rem + 24.31vw, 73.125rem);  /*width 360 324 PX	3840 1170*/
    height: clamp(7.75rem, 5.02165rem + 12.126vw, 34.125rem);  /*height	360	124	PX	3840	546	PX*/
    border-radius: 1.25rem;
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    margin-left: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem);
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr 1fr;
    padding: 2% 0 2% 0;
    justify-items: center;
    align-items: center;
}

.unit {
    display:flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    border: 1px solid rgba(201, 201, 201, 0.75);
    width: 80%;
    height: 90%;
    border-radius: 10px;
    
  }

@media (max-width: 991.98px) {
    .cardWrapper {
      width: 90vw;
      height: 174px;
    
      
    }

</style>

<div class="cardWrapper">

</div>
`;

class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      suplementalDataTemplate.content.cloneNode(true),
    );
    this.cardWrapper = this.shadowRoot.querySelector('.cardWrapper');
  }

  async render() {
    let unitContainer;

    const obj = {
      PoP: ['rain'],
      Sunrise: ['sunrise'],
      Humidity: ['humidity'],
      'UV Index': ['uvIndex'],
      Sunset: ['sunset'],
      Pressure: ['pressure'],
    };

    for (const key in obj) {
      unitContainer = document.createElement('div');
      unitContainer.classList.add('unit');
      unitContainer.innerHTML = `
            <p>${key}</p>
            <img id="rain" src="./images/${obj[key][0]}.svg" alt=""/>
            <p style="font-size: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem); height: clamp(0.875rem, 0.72395rem + 0.636vw, 2.25rem)" class="data"></p>
            `;
      this.cardWrapper.appendChild(unitContainer);
    }
  }

  async connectedCallback() {
    this.render();
  }
}

export { Dashboard };
