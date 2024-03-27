'use strict';
import { format } from 'date-fns';

const dailyForecastTemplate = document.createElement('template');

dailyForecastTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:host {
    --icon-width: clamp(3.5rem, 2.84094rem + 2.775vw, 9.5rem); /*icon width	380	56	PX	3840	152	PX*/
    --daily-lgFont: clamp(1.5rem, 1.30786rem + 0.809vw, 3.25rem); /* p	380	24	PX	3840	64	PX */
}
.dayContainer {
    display: flex;
    justify-content: center;
    align-items:center;
    background-color: var(--components-backgroundLight);
    box-shadow: var(--components-boxShadow);
    /*height: clamp(3.75rem, 2.84483rem + 4.023vw, 12.5rem); /*height	360	60	PX	3840	200	PX*/
    height: clamp(3.75rem, 3.09094rem + 2.775vw, 9.75rem);
    width: clamp(14rem, 10.92245rem + 13.678vw, 43.75rem); /*width	360	224	PX	3840	700	PX*/
    border-radius: var(--components-borderRadius);
    
}

.day{
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    height:100%;
}

.text {
    flex-basis: 45% ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}
.icon {
    flex-shrink: 1;
}
.temp {
    flex-shrink: 1;
}

.dayOfWeek{
    align-self: start;
    font-size: var(--daily-lgFont);
    font-weight: 400;
}

.temp{
    font-size: var(--small-text);
    font-weight: 400;
}

.description {
    font-size: var(--hourlyDaily-smFont); 
    font-weight: 400;
}

@media (max-width: 991.98px) {
    .dayContainer {
      width: 90vw;
      margin-left: var(--margin-leftRight);
    }
}
</style>
<div class='dayContainer'>
    <div class="day">
        <div class="text">
            <p class="dayOfWeek"></p>
            <p class="description"></p>
        </div>
        <div>
            <img style="width: var(--icon-width);" class="icon" src=""/>
        </div>
        <div>
            <p class="temp"></p>
        </div>
    </div>
</div>
`;

class DailyForecast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(dailyForecastTemplate.content.cloneNode(true));
  }
}

export { DailyForecast };
