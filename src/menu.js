'use strict';
let menuTemplate = document.createElement('template');
menuTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.menu {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: clamp(
        10.875rem,
        10.22835rem + 2.874vw,
        17.125rem
      ); /*width 360	174	PX	3840	274	PX */
      height: clamp(
        11rem,
        8.59625rem + 6.41vw,
        17.25rem
      ); /*height	600	176	PX	2160	276	PX*/
}
.menu div {
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: var(--small-text);
    flex: 1;
    padding: 0 5% 0 5%;
    height: 50%;
}
  
.menu div:hover {
    background-color: var(--hover-color);
    cursor: pointer;
}
  
.menu img {
    width: var(--icon-width);
    height: var(--icon-width);
    margin: 0 5% 0 0;
}
</style>

<div class="menu">
    <div id="theme"><img src="./images/moon.svg" alt=""><p>Dark</p></div>
    <div><img src="./images/thermometer.svg" alt=""><p>Celsius</p></div>
    <div><img src="./images/map-pin.svg" alt="Map pin icon for location settings"><p>Locations</p></div>
</div>
`;

class Menu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(menuTemplate.content.cloneNode(true));
  }

  themes() {
    const theme = this.shadowRoot.getElementById('theme');

    theme.addEventListener('click', () => {
      if (theme.lastElementChild.textContent === 'Dark') {
        theme.firstElementChild.setAttribute('src', './images/sun.svg');
        theme.lastElementChild.textContent = 'Light';
        document.body.style.backgroundImage = 'url("./images/darkMode.jpg")';
        document.documentElement.style.setProperty(
          '--components-backgroundLight',
          'rgba(47, 53, 71, 0.75)',
        );
        document.documentElement.style.setProperty('--menu-color', '#3d414f');
        document.body.style.color = '#EEF2FB';
      } else {
        theme.firstElementChild.setAttribute('src', './images/moon.svg');
        theme.lastElementChild.textContent = 'Dark';
        document.body.style.backgroundImage = 'url("./images/lightMode.jpg")';
        document.documentElement.style.setProperty(
          '--components-backgroundLight',
          'rgba(255, 255, 255, 0.75)',
        );
        document.documentElement.style.setProperty('--menu-color', '#f8fafd');
        document.body.style.color = '#4f5867';
      }
    });
  }

  connectedCallback() {
    this.themes();
  }
}

export { Menu };
