'use strict';

import { LocalCache } from './locationSettings';

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
    <div id="tempScale"><img src="./images/thermometer.svg" alt=""><p>Celsius</p></div>
    <div id="menuLocations"><img src="./images/map-pin.svg" alt="Map pin icon for location settings"><p>Locations</p></div>
</div>
`;

class Menu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(menuTemplate.content.cloneNode(true));
    this.theme = this.shadowRoot.getElementById('theme');
  }

  switchThemes() {
    this.theme.addEventListener('click', () => {
      if (this.theme.lastElementChild.textContent === 'Dark') {
        this.darkTheme();
      } else {
        this.lightTheme();
      }
    });
  }

  detectTheme() {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      this.darkTheme();
    } else {
      this.lightTheme();
    }
  }

  lightTheme() {
    this.theme.firstElementChild.setAttribute('src', './images/moon.svg');
    this.theme.lastElementChild.textContent = 'Dark';
    document.body.style.backgroundImage = 'url("./images/lightMode.jpg")';
    document.documentElement.style.setProperty(
      '--components-backgroundLight',
      'rgba(255, 255, 255, 0.75)',
    );
    document.documentElement.style.setProperty('--menu-color', '#f8fafd');
    document.body.style.color = '#4f5867';
  }

  darkTheme() {
    this.theme.firstElementChild.setAttribute('src', './images/sun.svg');
    this.theme.lastElementChild.textContent = 'Light';
    document.body.style.backgroundImage = 'url("./images/darkMode.jpg")';
    document.documentElement.style.setProperty(
      '--components-backgroundLight',
      'rgba(47, 53, 71, 0.75)',
    );
    document.documentElement.style.setProperty('--menu-color', '#3d414f');
    document.body.style.color = '#EEF2FB';
  }

  openSavedLocations() {
    const savedLocations = document.querySelector('saved-locations');
    const menuLocations = this.shadowRoot.getElementById('menuLocations');
    const settingsMenu = document.querySelector('settings-menu');
    const backdrop = document.querySelector('.backdrop');

    menuLocations.addEventListener('click', () => {
      savedLocations.prefillLookup();
      savedLocations.style.display = 'block';
      backdrop.style.display = 'block';
      settingsMenu.classList.remove('visible');
    });
  }

  setTemperatureScale() {
    const menuTempScale = this.shadowRoot.getElementById('tempScale');
    const storage = new LocalCache();
    const currentConditionsComponent =
      document.querySelector('current-conditions');
    const temperatureScale = storage.getParse('tempScale');

    menuTempScale.addEventListener('click', (e) => {
      if (menuTempScale.lastElementChild.textContent === 'Celsius') {
        storage.setStringify('tempScale', ['c', '&deg;C']);
        menuTempScale.lastElementChild.textContent = 'Fahrenheit';
        currentConditionsComponent.locationLookup(
          currentConditionsComponent.locationInput.value,
        );
      } else {
        storage.setStringify('tempScale', ['f', '&deg;F']);
        menuTempScale.lastElementChild.textContent = 'Celsius';
        currentConditionsComponent.locationLookup(
          currentConditionsComponent.locationInput.value,
        );
      }
    });

    if (!temperatureScale) {
      return;
    }

    if (temperatureScale[0] === 'f') {
      menuTempScale.lastElementChild.textContent = 'Celsius';
    } else {
      menuTempScale.lastElementChild.textContent = 'Fahrenheit';
    }
  }

  connectedCallback() {
    this.switchThemes();
    this.openSavedLocations();
    this.setTemperatureScale();
  }
}

export { Menu };
