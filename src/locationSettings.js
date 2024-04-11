import { CurrentConditions } from './currentConditions';
import { AutoComplete } from './autoComplete';
('use strict');
const savedLocationTemplate = document.createElement('template');
savedLocationTemplate.innerHTML = `
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

p {
    font-size: var(--small-text);
    text-align: center;
    align-self: start;
}


.locationModal{
    display: grid;
    grid-template: .25fr .25fr .20fr 1fr / auto;
    position: relative;
    height: clamp(16.1875rem, 12.97405rem + 14.282vw, 47.25rem); /* height 360	259	PX	3840	756	PX  other 35vh*/
    width:  clamp(18rem, 14.89658rem + 13.793vw, 48rem); /* width 360	288	PX	3840	768*/
    background-color: rgba(255, 255, 255, 1);
    border-radius: var(--components-borderRadius);
    backdrop-filter: 10px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 12;
    box-shadow: var(--components-boxShadow);
    padding: 2vh;
}

.exitModal{
    position: absolute;
    width: var(--icon-width);
    top: 1vh;
    right: 1vw;
}

.inputContainer {
    position: relative;
    grid-area: 2/1/3/2;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.innerInput {
    position: relative;
    border: 0;
    display: flex;
    align-items: center;
    width: 100%;
}

.innerIcons {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
}

.emptyDiv{
    width: clamp(11.25rem, 8.92238rem + 10.345vw, 33.75rem);
}


#lookup{
    width: 90%;
    padding: 0 14% 0 5px;
    background-color: #eee;
    border-style: none;
    color: var(--lightMode-text);
    height: var(--medium-text);
    border-radius: 6px;
    font-size: var(--small-text);
    z-index: 1;
}

#dropdown{
    position: absolute;
    top: 104%;
    grid-area: 3/1/4/2;
    background-color: #eee;
    width: 90%;
    height: 100px;
    margin-left: 2%;
    border-radius: 10px;
    color: var(--lightMode-text);
    overflow-y: auto;
    visibility: hidden;
    z-index: 2; 
  }

  .dropdownValue {
    padding: 5px;
    font-size: var(--search-font); 
  }

  .dropdownValue:hover{
    cursor: pointer;
    background-color: #858585b3;
  }

  .selected {
    background-color: #858585b3;
  }

  .clearText {
    visibility: hidden;
    width: var(--icon-width);
    height: var(--icon-width);
    z-index:1;
  }
  .addButton {
    width: var(--icon-width);
    height: var(--icon-width);
    z-index:1;
  }

  .addButton:hover{
    cursor: pointer;
  }

  .savedContainer{
    overflow-y: auto;
    grid-area: 4/1/5/2;
    height: 100%;
    width: 100%;
    border: 1px solid #858585b3;
    border-radius: 10px;
    
  }

  .savedItem{
    display: flex;
    padding: 5px;
    justify-content: space-between;
    width: 100%;
  }

  .savedItem p{
    font-size: var(--small-text);
    text-align: left;
    width: clamp(11.25rem, 8.92238rem + 10.345vw, 33.75rem);
  }

  .savedItem img {
    width: var(--icon-width);
    height: var(--icon-width);
  }
  .star {
    width: var(--icon-width);
    height: var(--icon-width);
    background: url("./images/star.svg");
  }
  .goldStar {
    width: var(--icon-width);
    height: var(--icon-width);
    background: url("./images/star-fill.svg");
  }

  @media (max-width: 991.98px) {
    .addButton {
        bottom: 0;
    }
  }

</style>

    <div class="locationModal">
        <img class="exitModal" src="./images/close-outline.svg" alt="Close Modal Window">
        <p>Saved Locations</p>
        <div class="inputContainer">
            <label for="lookup">Add Location</label>
            <div class="innerInput">
              <input type="text" id="lookup" name="lookup"></input>
              
              <div class="innerIcons">
                <div class="emptyDiv"></div>
                <img src="./images/x-circle-fill.svg" alt="clear input text" class="clearText">
                <img src="./images/add-outline.svg" alt="add button" class="addButton">
              </div>
              
            </div>
            <div id="dropdown"></div>
            
            
        </div>
        
        <div class="savedContainer">
        
        </div>
        
    </div>

`;

class LocationSettings extends HTMLElement {
  constructor(current) {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(savedLocationTemplate.content.cloneNode(true));
    this.locationInput = this.shadowRoot.getElementById('lookup'); //Text input for location lookup of temperature
    this.dropdownList = this.shadowRoot.getElementById('dropdown'); //retrieves <div> of location values
    this.clearIcon = this.shadowRoot.querySelector('.clearText');
    this.lookupInput = this.shadowRoot.getElementById('lookup');
    // this.savedLocationsArray = [];
    this.localCache = new LocalCache();
    this.autoComplete = new AutoComplete(this);
  }

  closeModalWindow() {
    const exitModal = this.shadowRoot.querySelector('.exitModal');
    exitModal.addEventListener('click', () => {
      //   const savedLocations = document.querySelector('saved-locations');
      //   savedLocations.style.visibility = 'hidden';
      this.prefillLookup();
    });
  }

  //Prefills the input with the location from the previous screen
  prefillLookup() {
    const input = document
      .querySelector('current-conditions')
      .shadowRoot.getElementById('search-location').value;
    this.lookupInput.value = input;
    this.autoComplete.clearLocationInputValue(this.lookupInput.value);
  }

  //The add button to add locations to local storage and render it in the ui
  addToUI() {
    const addButton = this.shadowRoot.querySelector('.addButton');
    addButton.addEventListener('click', () => {
      const noDuplicates = this.localCache.parseLocations();
      console.log(!this.lookupInput.value.match(/^[^,]*,[^,]*$/g));
      if (
        !this.lookupInput.value ||
        !this.lookupInput.value.match(/^[^,]*,[^,]*$/g)
      ) {
        return;
      } else if (
        noDuplicates &&
        noDuplicates.includes(this.locationInput.value)
      ) {
        return;
      } else {
        console.log(this.locationInput.value);
        this.localCache.addToLocalStorage(this.locationInput.value);
        this.renderSavedLocations(this.locationInput.value);
        this.locationInput.value = '';
        this.clearIcon.style.visibility = 'hidden';
      }
    });
  }

  //Renders the UI.
  renderSavedLocations(lookupInput) {
    const saved = this.shadowRoot.querySelector('.savedContainer');
    const savedLocationsDiv = document.createElement('div');
    const removeLocation = document.createElement('img');
    const favorite = document.createElement('div');
    const pElement = document.createElement('p');
    savedLocationsDiv.classList.add('savedItem');
    pElement.innerHTML = lookupInput;
    removeLocation.src = './images/x-circle-fill.svg';
    removeLocation.classList.add('removeSavedLocation');
    favorite.classList.add('star');
    saved.appendChild(savedLocationsDiv);
    savedLocationsDiv.appendChild(pElement);
    savedLocationsDiv.appendChild(removeLocation);
    savedLocationsDiv.appendChild(favorite);
  }

  renderLocalStorage() {
    const locationsInStorage = this.localCache.parseLocations();
    if (!locationsInStorage) {
      return;
    } else {
      locationsInStorage.forEach((value) => {
        this.renderSavedLocations(value);
      });
    }
  }

  removeFromUI() {
    const removedButton = this.shadowRoot.querySelector('.removeSavedLocation');
    const saved = this.shadowRoot.querySelector('.savedContainer');
    saved.addEventListener('click', (event) => {
      if (event.target.className === 'removeSavedLocation') {
        event.target.parentElement.remove();
        this.localCache.removeFromStorage(
          event.target.previousElementSibling.textContent,
        );
        this.localCache.setFavorite('');
      }
    });
  }

  favorite() {
    const saved = this.shadowRoot.querySelector('.savedContainer');

    saved.addEventListener('click', (event) => {
      let goldStar = saved.getElementsByClassName('goldStar');
      let target = event.target.classList;

      if (!target.contains('star')) {
        return;
      }

      let city =
        event.target.previousElementSibling.previousElementSibling.textContent;

      if (goldStar.length === 0) {
        target.add('goldStar');
        this.localCache.setFavorite(city);
        this.refreshComponent();
      } else if (target.contains('goldStar')) {
        target.remove('goldStar');
        this.localCache.setFavorite('');
      } else if (goldStar.length) {
        goldStar[0].classList.remove('goldStar');
        target.add('goldStar');
        this.localCache.setFavorite(city);
        this.refreshComponent();
      }
    });

    [...saved.children].forEach((value) => {
      if (
        value.children.item('p').textContent === this.localCache.getFavorite()
      ) {
        value.children[2].classList.add('goldStar');
      }
    });
  }

  viewOtherSavedLocations() {
    const saved = this.shadowRoot.querySelector('.savedContainer');
    saved.addEventListener('click', (event) => {
      if (event.target.tagName === 'P') {
        this.localCache.setSaved(event.target.textContent);
        this.refreshComponent();
      }
    });
  }
  refreshComponent() {
    const component = document.createElement('current-conditions');
    document.querySelector('current-conditions').remove();
    document.querySelector('.container').append(component);
  }

  connectedCallback() {
    this.autoComplete.createDrowpdownList();
    this.autoComplete.selectLocationsByKeydown();
    this.renderLocalStorage();
    this.addToUI();
    this.closeModalWindow();
    this.removeFromUI();
    this.favorite();
    this.viewOtherSavedLocations();
  }
}

class LocalCache {
  constructor() {
    this.savedLocationsArray = [];
  }
  addToLocalStorage(lookupInput) {
    this.savedLocationsArray = this.parseLocations() || [];
    console.log(lookupInput);
    console.log(typeof this.savedLocationsArray);
    this.savedLocationsArray.push(lookupInput);
    this.stringify();
  }
  parseLocations() {
    const savedLocations = localStorage.getItem('locations');
    const parsed = JSON.parse(savedLocations);
    return parsed;
  }
  stringify() {
    // this.savedLocationsArray.push(location);
    const stringifiedLocations = JSON.stringify(this.savedLocationsArray);
    localStorage.setItem('locations', stringifiedLocations);
    console.log(this.savedLocationsArray);
  }

  removeFromStorage(string) {
    let index = this.parseLocations().indexOf(string);
    this.savedLocationsArray = this.parseLocations();
    console.log(this.savedLocationsArray);
    this.savedLocationsArray.splice(index, 1);
    this.stringify();
    console.log(this.parseLocations());
    console.log(this.savedLocationsArray);
  }

  setFavorite(string) {
    let favorite = JSON.stringify(string);
    localStorage.setItem('favorite', favorite);
  }

  getFavorite() {
    let favorite = localStorage.getItem('favorite');
    return JSON.parse(favorite);
  }

  setSaved(string) {
    let saved = JSON.stringify(string);
    localStorage.setItem('saved', saved);
  }
  getSaved() {
    let saved = localStorage.getItem('saved');
    return JSON.parse(saved);
  }
}

export { LocationSettings, LocalCache };
