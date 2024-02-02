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
}

// Example usage:
async function getLocation() {
  try {
    const position = await GeoLocation.getCurrentPosition();
    console.log(position);
    return position;
    // Do something with position.latitude and position.longitude
  } catch (error) {
    console.error('Error getting geolocation:', error.message);
  }
}

class WeatherAPI {
  constructor() {
    this.url = 'http://api.weatherapi.com/v1/';
    this.APIKEY = '2781e0322a6547ef98a113813241901';
  }

  async currentWeatherbyPos(query) {
    try {
      const position = await GeoLocation.getCurrentPosition();

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

// const weatherOnLocation = new WeatherAPI();
// GeoLocation.getCurrentPosition();

// weatherOnLocation.currentWeatherbyPos('18914').then((data) => {
//   console.log(data.current);
// });

export { WeatherAPI, GeoLocation };
