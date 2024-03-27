'use strict';
class GeoLocation {
  static getCurrentPosition() {
    return new Promise((resolve, reject) => {
      //Geolocation API that retrieves current postion.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude }); //returns the Latitude and longitude of current location.
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
  static async latLong() {
    try {
      const position = await GeoLocation.getCurrentPosition(); //with the latitude and longitude coordinates it can be used by the render method of currentConditions class.
      console.log(position.latitude + ', ' + position.longitude);
      const cposition = position.latitude + ', ' + position.longitude;
      return cposition; // Do something with position.latitude and position.longitude
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        console.log('You blocked access to your location');
        //if user decides to block access to location, default will be New york City.
        return 'new york city';
      } else {
        console.error('Error getting geolocation:', error.message); //Console log any other errors for review.
      }
    }
  }
}

class WeatherAPI {
  constructor() {
    this.url = 'https://api.weatherapi.com/v1/';
    this.APIKEY = '2781e0322a6547ef98a113813241901';
  }

  //current weather data only
  async current(query) {
    const call = `current.json?key=${this.APIKEY}&q=${query} &aqi=no`;
    return await this.queryCurrentConditions(call);
  }
  //current weather + forecast for 3 days (free trial)
  async forecast(query) {
    const call = `forecast.json?key=${this.APIKEY}&q=${query}&days=3&aqi=no&alerts=no`;
    return await this.queryCurrentConditions(call);
  }

  //makes a call to the weather api
  async queryCurrentConditions(apiCall) {
    try {
      const response = await fetch(this.url + apiCall, { mode: 'cors' });
      let data = await response.json();
      return data; //returns weather data
    } catch (error) {
      console.error('Error getting geolocation:', error.message);
      throw new Error('Error getting geolocation: ', error.message);
    }
  }

  //retrieves a list of locations from api.weatherapi.com
  async autoCompleteList(query) {
    const call = `search.json?key=${this.APIKEY}&q=${query}`;
    try {
      const response = await fetch(this.url + call, { mode: 'cors' });
      let data = await response.json();
      return data; //returns list of locations from api
    } catch (error) {
      console.log(error.message);
    }
  }
}

export { WeatherAPI, GeoLocation };
