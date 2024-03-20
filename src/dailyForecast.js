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

.dayContainer {
    display: flex;
    justify-content: center;
    align-items:center;
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    /*width: 700px; /*width	360	100	PX	3840	388	PX*/
    height: clamp(3.75rem, 2.84483rem + 4.023vw, 12.5rem); /*height	360	60	PX	3840	200	PX*/
    width: clamp(14rem, 10.92245rem + 13.678vw, 43.75rem); /*width	360	224	PX	3840	700	PX*/
    border-radius: 1.25rem;

    img {width: clamp(3.75rem, 2.84483rem + 4.023vw, 12.5rem);}
}

.day{
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    height:100%
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

@media (max-width: 991.98px) {
    .dayContainer {
      width: 90vw;
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
            <img style="width: 56px" class="icon" src=""/>
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
