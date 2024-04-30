import { WeatherAPI } from './weatherApi';
const todaysWeather = new WeatherAPI();

class AutoComplete {
  constructor(current) {
    this.current = current;
  }
  createDrowpdownList() {
    this.current.locationInput.addEventListener('input', (e) => {
      this.clearLocationInputValue(e.target.value); //Reveals button to clear text when input detected
      if (!e.target.value) {
        this.current.dropdownList.style.visibility = 'hidden';
      } else {
        todaysWeather.autoCompleteList(e.target.value).then((data) => {
          this.current.dropdownList.innerHTML = '';
          if (data.length > 0) {
            this.current.dropdownList.style.visibility = 'visible';
            data.forEach((value) => {
              const specificLocation = document.createElement('div');
              specificLocation.classList.add('dropdownValue');
              specificLocation.setAttribute('name', value.name);
              specificLocation.setAttribute('region', value.region);
              specificLocation.innerHTML = `${value.name}, ${value.region}, ${value.country}`;
              this.current.dropdownList.appendChild(specificLocation);
              //Event listener for clicking the location in the dropdown
              this.selectLocationByClick(
                specificLocation,
                value.name,
                value.region,
              );
            });
          } else {
            this.current.dropdownList.style.visibility = 'hidden';
          }
        });
      }
    });
  }

  //reveal clear text icon and the listener to clear the text in the input field
  clearLocationInputValue(e) {
    if (!e) {
      this.current.clearIcon.style.visibility = 'hidden';
    } else {
      this.current.clearIcon.style.visibility = 'visible';
    }
    this.current.clearIcon.addEventListener('click', () => {
      this.current.locationInput.value = '';
      this.current.clearIcon.style.visibility = 'hidden';
      this.current.dropdownList.style.visibility = 'hidden';
    });
  }

  selectLocationByClick(div, name, region) {
    div.addEventListener('click', (e) => {
      this.current.dropdownList.style.visibility = 'hidden';
      this.current.locationInput.value = `${name}, ${region}`;
      if (!this.current.locationLookup) {
        return null;
      } else {
        this.current.locationLookup(this.current.locationInput.value);
      }
    });
  }

  selectLocationsByKeydown() {
    //Allows use of keyboard to select location values
    let index = -1;
    let prevIndex;

    this.current.locationInput.addEventListener('keydown', (e) => {
      const allLocationValues =
        this.current.shadowRoot.querySelectorAll('.dropdownValue');
      if (allLocationValues.length <= 0) {
        return;
      }
      //Traverses location list up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        reverseListSelection();
        this.current.shadowRoot.querySelector('.selected').scrollIntoView();
      } else if (e.shiftKey) {
        //Traverses location list up using shift + tab
        e.preventDefault();
        if (e.key === 'Tab') {
          reverseListSelection();
          this.current.shadowRoot.querySelector('.selected').scrollIntoView();
        }
      } else if (e.key === 'Tab' || e.key === 'ArrowDown') {
        //Traverses location list down
        e.preventDefault();
        index++;
        prevIndex = index - 1;
        if (index > allLocationValues.length - 1) {
          index = 0;
          prevIndex = allLocationValues.length - 1;
        }
        allLocationValues[index].classList.add('selected');
        if (prevIndex >= 0 && allLocationValues.length > 1) {
          allLocationValues[prevIndex].classList.remove('selected');
        }

        this.current.shadowRoot.querySelector('.selected').scrollIntoView();
      } else if (e.key === 'Enter') {
        let indexValue = '';
        if (allLocationValues[index]) {
          indexValue = `${allLocationValues[index].getAttribute('name')}, ${allLocationValues[index].getAttribute('region')}`;
        } else {
          indexValue = `${allLocationValues[0].getAttribute('name')}, ${allLocationValues[0].getAttribute('region')}`;
        }
        this.current.locationInput.value = indexValue;
        this.current.dropdownList.style.visibility = 'hidden';
        // return this.current.locationLookup(indexValue);
        if (!this.current.locationLookup) {
          return null;
        } else {
          return this.current.locationLookup(indexValue);
        }
      } else {
        index = -1;
      }

      function reverseListSelection() {
        if (index === -1) {
          index++;
        }
        index--;
        prevIndex = index + 1;
        if (index < 0) {
          index = allLocationValues.length - 1;
        }
        allLocationValues[index].classList.add('selected');
        if (prevIndex >= 0 && allLocationValues.length > 1) {
          allLocationValues[prevIndex].classList.remove('selected');
        }
      }
    });
  }
}

export { AutoComplete };
