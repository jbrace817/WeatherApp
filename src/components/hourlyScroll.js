'use strict';

const hourlyDataTemplate = document.createElement('template');

hourlyDataTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
.hourlyContainer {
    background-color: var(--components-backgroundLight);
    width: clamp(14rem, 6.39658rem + 33.793vw, 87.5rem); /*width	360	224	PX	3840	1400	PX */
    height: clamp(6.875rem, 6.0344rem + 3.736vw, 15rem); /*width	360	140	PX	3840	240	PX */
    border-radius: var(--components-borderRadius);
    box-shadow: var(--components-boxShadow);
    margin: 0 var(--margin-leftRight) 0 var(--margin-leftRight)
}

.allHours{
    display: flex;
    height: 100%;
    gap: 6%;
    overflow-x: auto;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.allHours::-webkit-scrollbar { /*chrome and safari*/
    display: none;
  }

.hour{
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*border:1px solid pink;*/
    align-items: center;
    gap:4%;
}

.time, .temp{
  font-size: var(--hourlyDaily-smFont)
}
img {
  width:clamp(2.75rem, 2.22821rem + 2.197vw, 7.5rem); /*image	380	44	PX	3840	130	PX*/"
}

@media (max-width: 991.98px) {
    .hourlyContainer {
      width: 90vw;
      margin: 0 0 0 var(--margin-leftRight)
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
  }

  render() {}

  connectedCallback() {}
}

export { HourlyScroll };
