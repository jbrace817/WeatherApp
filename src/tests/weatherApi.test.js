import { WeatherAPI } from '../weatherApi.js';

describe('weather API tests', () => {
  const MOCK_DATA = {
    location: {
      name: 'New City',
      region: 'New York',
      country: 'United States of America',
      lat: 41.15,
      lon: -73.99,
      tz_id: 'America/New_York',
      localtime_epoch: 1708973104,
      localtime: '2024-02-26 13:45',
    },
    current: {
      last_updated_epoch: 1708973100,
      last_updated: '2024-02-26 13:45',
      temp_c: 8.3,
      temp_f: 46.9,
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000,
      },
      wind_mph: 6.9,
      wind_kph: 11.2,
      wind_degree: 190,
      wind_dir: 'S',
      pressure_mb: 1016.0,
      pressure_in: 30.0,
      precip_mm: 0.0,
      precip_in: 0.0,
      humidity: 56,
      cloud: 0,
      feelslike_c: 6.3,
      feelslike_f: 43.4,
      vis_km: 16.0,
      vis_miles: 9.0,
      uv: 3.0,
      gust_mph: 8.4,
      gust_kph: 13.6,
    },
  };

  it('should return current weather in New York City', async () => {
    // This part fakes fetch and resolves it by return MOCK_DATA
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(MOCK_DATA),
      }),
    );
    const weatherNYC = new WeatherAPI();
    const result = await weatherNYC.current('New City');
    console.log(result.current);
    expect(result.current.temp_f).toBe(46.9);
  });

  it('should return the city name', async () => {
    const weatherNYC = new WeatherAPI();
    const result = await weatherNYC.current('New City');
    console.log(result.location.name);
    expect(result.location.name).toBe('New City');
  });
});

describe('Fetch forecast Data', () => {
  // This part fakes fetch and resolves it by returning mock data.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          location: {
            name: 'New City',
            region: 'New York',
            country: 'United States of America',
            lat: 41.15,
            lon: -73.99,
            tz_id: 'America/New_York',
            localtime_epoch: 1708973104,
            localtime: '2024-02-26 13:45',
          },
          current: {
            last_updated_epoch: 1708973100,
            last_updated: '2024-02-26 13:45',
            temp_c: 8.3,
            temp_f: 46.9,
            is_day: 1,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
            wind_mph: 6.9,
            wind_kph: 11.2,
            wind_degree: 190,
            wind_dir: 'S',
            pressure_mb: 1016.0,
            pressure_in: 30.0,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 56,
            cloud: 0,
            feelslike_c: 6.3,
            feelslike_f: 43.4,
            vis_km: 16.0,
            vis_miles: 9.0,
            uv: 3.0,
            gust_mph: 8.4,
            gust_kph: 13.6,
          },
        }),
    }),
  );
});
