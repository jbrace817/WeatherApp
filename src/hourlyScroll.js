'use strict';
import { CurrentConditions } from './currentConditions';

const hourlyDataTemplate = document.createElement('template');

hourlyDataTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
.hourlyContainer {
    background-color: rgba(255, 255, 255, 0.75);
    width: clamp(14rem, 6.39658rem + 33.793vw, 87.5rem); /*width	360	224	PX	3840	1400	PX */
    height: clamp(10vh, 12vh, 14vh); /**/
    border-radius: 1.25rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    margin-right: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem)
    
}

.allHours{
    display: flex;
    /*border: 1px solid green;*/
    height: 100%;
    gap: 5px;
    overflow-x: auto;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.allHours::-webkit-scrollbar {
    display: none;
  }

.hour{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /*border:1px solid pink;*/
    align-items: center;
}

.time{
    /*border: 1px solid red;*/
}
img{
    /*border: 1px solid blue;*/
    width: 64px;
    height: 64px;
}


@media (max-width: 991.98px) {
    .hourlyContainer {
      width: 90vw;
      margin-left: clamp(1rem, -1.05936rem + 8.671vw, 19.75rem);
    
      
    }
}
</style>
<div class="hourlyContainer">
    <div class="allHours">
        
        
    </div>
</div>
`;

class HourlyScroll extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(hourlyDataTemplate.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('.allHours');
  }

  render() {}

  connectedCallback() {}
}

export { HourlyScroll };
