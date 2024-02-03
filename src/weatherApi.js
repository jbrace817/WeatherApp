'use strict';
class GeoLocation {
  static getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
  static async latLong() {
    try {
      const position = await GeoLocation.getCurrentPosition();
      console.log(position.latitude + ', ' + position.longitude);
      const cposition = position.latitude + ', ' + position.longitude;
      return cposition;
      // Do something with position.latitude and position.longitude
    } catch (error) {
      console.error('Error getting geolocation:', error.message);
    }
  }
}

class WeatherAPI {
  constructor() {
    this.url = 'http://api.weatherapi.com/v1/';
    this.APIKEY = '2781e0322a6547ef98a113813241901';
  }

  //   async currentWeatherbyPos() {
  //     try {
  //       const position = await GeoLocation.getCurrentPosition();

  //       const response = await fetch(
  //         this.url +
  //           `current.json?key=${this.APIKEY}&q=${position.latitude},${position.longitude} &aqi=no`,
  //         { mode: 'cors' },
  //       );
  //       let data = await response.json();
  //       return data;
  //       // Do something with position.latitude and position.longitude
  //     } catch (error) {
  //       console.error('Error getting geolocation:', error.message);
  //       throw new Error('Error getting geolocation: ', error.message);
  //     }
  //   }

  async queryCurrentConditions(query) {
    try {
      const response = await fetch(
        this.url + `current.json?key=${this.APIKEY}&q=${query} &aqi=no`,
        { mode: 'cors' },
      );
      let data = await response.json();
      return data;
      // Do something with position.latitude and position.longitude
    } catch (error) {
      console.error('Error getting geolocation:', error.message);
      throw new Error('Error getting geolocation: ', error.message);
    }
  }
}

export { WeatherAPI, GeoLocation };
