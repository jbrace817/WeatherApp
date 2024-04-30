//This class accesses the localStorage API
class AppStorage {
  constructor() {
    this.savedLocationsArray = []; //array of locations in localStorage
  }

  addToLocalStorage(lookupInput) {
    this.savedLocationsArray = this.getParse() || []; //gets or creates an array associated with the 'locations' key
    this.savedLocationsArray.push(lookupInput);
    this.setStringify();
  }

  //gets localStorage JSON data by key and parses it to a JS value or object
  getParse(key) {
    if (!key) {
      const allLocations = localStorage.getItem('locations');
      const parsed = JSON.parse(allLocations);
      return parsed;
    } else {
      const item = localStorage.getItem(key);
      const parsed = JSON.parse(item);
      return parsed;
    }
  }

  //converts data from JavaScript to a JSON String
  setStringify(key, location) {
    if (!key) {
      const stringifiedLocations = JSON.stringify(this.savedLocationsArray);
      localStorage.setItem('locations', stringifiedLocations);
    } else {
      let value = JSON.stringify(location);
      localStorage.setItem(key, value);
    }
  }

  removeFromStorage(string) {
    let index = this.getParse().indexOf(string);
    this.savedLocationsArray = this.getParse();
    this.savedLocationsArray.splice(index, 1);
    this.setStringify();
    console.log(this.getParse());
    console.log(this.savedLocationsArray);
  }
}

export { AppStorage };
