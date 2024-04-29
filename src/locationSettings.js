import { CurrentConditions } from './currentConditions';
import { AutoComplete } from './autoComplete';
import { AppStorage } from './appAPI/appStorage';
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
    background-color: var(--menu-color);
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
    color: #4f5867;
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
    color: #4f5867;
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
    background-color: var(--hover-color);
  }

  .selected {
    background-color: var(--hover-color);
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
    border: 1px solid var(--hover-color);
    border-radius: 10px;
    
  }

  .savedItem{
    display: flex;
    padding: 5px;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
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

    .locationModal{
      height: 44vh;
    }

    #lookup{
      width: 88%;
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
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(savedLocationTemplate.content.cloneNode(true));
    this.locationInput = this.shadowRoot.getElementById('lookup'); //Text input for location lookup of temperature
    this.dropdownList = this.shadowRoot.getElementById('dropdown'); //retrieves <div> of location values
    this.clearIcon = this.shadowRoot.querySelector('.clearText');
    this.lookupInput = this.shadowRoot.getElementById('lookup');
    this.storage = new AppStorage();
    this.autoComplete = new AutoComplete(this);
    this.currentConditionsComponent =
      document.querySelector('current-conditions'); //<current-conditions> object

    //Storage Keys
    this.locationArray = 'locations';
    this.favoriteLocation = 'favorite';
  }

  closeModalWindow() {
    const exitModal = this.shadowRoot.querySelector('.exitModal');
    const savedLocations = document.querySelector('saved-locations');
    const backdrop = document.querySelector('.backdrop');
    let clearIconVisiblilty = this.clearIcon.style.visibility;
    exitModal.addEventListener('click', () => {
      clearIconVisiblilty = 'hidden';
      displayNone();
    });
    backdrop.addEventListener('click', () => {
      clearIconVisiblilty = 'hidden';
      displayNone();
    });

    function displayNone() {
      savedLocations.style.display = 'none';
      backdrop.style.display = 'none';
    }
  }

  //Prefills the input with the location from the previous screen
  prefillLookup() {
    const mainAppInput = this.currentConditionsComponent.locationInput.value;
    console.log(mainAppInput);
    this.lookupInput.value = mainAppInput;
    this.autoComplete.clearLocationInputValue(this.lookupInput.value);
  }

  //The add button to add locations to local storage and render it in the ui
  addToUI() {
    const addButton = this.shadowRoot.querySelector('.addButton');
    addButton.addEventListener('click', () => {
      const noDuplicates = this.storage.getParse(this.locationArray);
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
        this.storage.addToLocalStorage(this.locationInput.value);
        this.renderSavedLocations(this.locationInput.value);
        this.locationInput.value = '';
        this.clearIcon.style.visibility = 'hidden';
      }
    });
  }

  //Renders the UI
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

  //renders each location saved in locaStorage to the UI when the window is opened
  renderLocalStorage() {
    const locationsInStorage = this.storage.getParse(this.locationArray);
    if (!locationsInStorage) {
      return;
    } else {
      locationsInStorage.forEach((value) => {
        this.renderSavedLocations(value);
      });
    }
  }

  removeFromUI() {
    const saved = this.shadowRoot.querySelector('.savedContainer');
    saved.addEventListener('click', (event) => {
      if (event.target.className === 'removeSavedLocation') {
        event.target.parentElement.remove();
        this.storage.removeFromStorage(
          event.target.previousElementSibling.textContent,
        );
        this.storage.setStringify(this.favoriteLocation, null);
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
        this.storage.setStringify(this.favoriteLocation, city);
        this.refreshComponent(city);
      } else if (target.contains('goldStar')) {
        target.remove('goldStar');
        this.storage.setStringify(this.favoriteLocation, null);
      } else if (goldStar.length) {
        goldStar[0].classList.remove('goldStar');
        target.add('goldStar');
        this.storage.setStringify(this.favoriteLocation, city);
        this.refreshComponent(city);
      }
    });

    //applies a gold star to the location saved as a favorite from the localStorage API
    [...saved.children].forEach((value) => {
      if (
        value.children.item('p').textContent ===
        this.storage.getParse(this.favoriteLocation)
      ) {
        value.children[2].classList.add('goldStar');
      }
    });
  }

  //Allows the user to view other saved locations with out having to change the favorite location
  viewOtherSavedLocations() {
    const saved = this.shadowRoot.querySelector('.savedContainer');
    saved.addEventListener('click', (event) => {
      if (event.target.tagName === 'P') {
        this.refreshComponent(event.target.textContent);
      }
    });
  }

  //refreshes all components to match the location chosen
  refreshComponent(string) {
    const currentConditions = this.currentConditionsComponent;
    currentConditions.locationLookup(string);
    currentConditions.locationInput.value = string;
  }

  connectedCallback() {
    this.autoComplete.createDrowpdownList();
    this.autoComplete.selectLocationsByKeydown();
    this.prefillLookup();
    this.renderLocalStorage();
    this.addToUI();
    this.closeModalWindow();
    this.removeFromUI();
    this.favorite();
    this.viewOtherSavedLocations();
  }
}

export { LocationSettings };
