import { WeatherAPI } from '../weatherApi.js';
describe('Fetch forecast Data', () => {
  // This part fakes fetch and resolves it by returning mock data.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          location: {
            name: 'Austin',
            region: 'Texas',
            country: 'United States of America',
            lat: 30.27,
            lon: -97.74,
            tz_id: 'America/Chicago',
            localtime_epoch: 1708980226,
            localtime: '2024-02-26 14:43',
          },
          current: {
            last_updated_epoch: 1708979400,
            last_updated: '2024-02-26 14:30',
            temp_c: 26.7,
            temp_f: 80.1,
            is_day: 1,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
            wind_mph: 2.2,
            wind_kph: 3.6,
            wind_degree: 199,
            wind_dir: 'SSW',
            pressure_mb: 1012.0,
            pressure_in: 29.89,
            precip_mm: 0.0,
            precip_in: 0.0,
            humidity: 60,
            cloud: 0,
            feelslike_c: 26.9,
            feelslike_f: 80.5,
            vis_km: 16.0,
            vis_miles: 9.0,
            uv: 7.0,
            gust_mph: 14.4,
            gust_kph: 23.2,
          },
          forecast: {
            forecastday: [
              {
                date: '2024-02-26',
                date_epoch: 1708905600,
                day: {
                  maxtemp_c: 29.6,
                  maxtemp_f: 85.3,
                  mintemp_c: 16.1,
                  mintemp_f: 61.0,
                  avgtemp_c: 22.0,
                  avgtemp_f: 71.5,
                  maxwind_mph: 13.4,
                  maxwind_kph: 21.6,
                  totalprecip_mm: 0.0,
                  totalprecip_in: 0.0,
                  totalsnow_cm: 0.0,
                  avgvis_km: 10.0,
                  avgvis_miles: 6.0,
                  avghumidity: 71,
                  daily_will_it_rain: 0,
                  daily_chance_of_rain: 0,
                  daily_will_it_snow: 0,
                  daily_chance_of_snow: 0,
                  condition: {
                    text: 'Partly Cloudy ',
                    icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                    code: 1003,
                  },
                  uv: 6.0,
                },
                astro: {
                  sunrise: '07:01 AM',
                  sunset: '06:27 PM',
                  moonrise: '08:32 PM',
                  moonset: '08:11 AM',
                  moon_phase: 'Waning Gibbous',
                  moon_illumination: 98,
                  is_moon_up: 0,
                  is_sun_up: 1,
                },
                hour: [
                  {
                    time_epoch: 1708927200,
                    time: '2024-02-26 00:00',
                    temp_c: 18.8,
                    temp_f: 65.9,
                    is_day: 0,
                    condition: {
                      text: 'Clear ',
                      icon: '//cdn.weatherapi.com/weather/64x64/night/113.png',
                      code: 1000,
                    },
                    wind_mph: 9.6,
                    wind_kph: 15.5,
                    wind_degree: 182,
                    wind_dir: 'S',
                    pressure_mb: 1015.0,
                    pressure_in: 29.97,
                    precip_mm: 0.0,
                    precip_in: 0.0,
                    snow_cm: 0.0,
                    humidity: 86,
                    cloud: 3,
                    feelslike_c: 18.8,
                    feelslike_f: 65.9,
                    windchill_c: 18.8,
                    windchill_f: 65.9,
                    heatindex_c: 19.0,
                    heatindex_f: 66.1,
                    dewpoint_c: 16.1,
                    dewpoint_f: 61.0,
                    will_it_rain: 0,
                    chance_of_rain: 0,
                    will_it_snow: 0,
                    chance_of_snow: 0,
                    vis_km: 10.0,
                    vis_miles: 6.0,
                    gust_mph: 17.1,
                    gust_kph: 27.5,
                    uv: 1.0,
                  },
                ],
              },
            ],
          },
        }),
    }),
  );

  it('should return the city name', async () => {
    const weatherAustin = new WeatherAPI();
    const result = await weatherAustin.forecast('Austin');
    console.log(result.location.name);
    expect(result.location.name).toBe('Austin');
  });
  it('should return the day 0 maxtemp_f', async () => {
    const weatherAustin = new WeatherAPI();
    const result = await weatherAustin.forecast('Austin');
    console.log(result.location.name);
    expect(result.forecast.forecastday[0].day.maxtemp_f).toBe(85.3);
  });
  it('should return hour 00:00 condition text property', async () => {
    const weatherAustin = new WeatherAPI();
    const result = await weatherAustin.forecast('Austin');
    console.log(result.location.name);
    expect(result.forecast.forecastday[0].hour[0].condition.text).toBe(
      'Clear ',
    );
  });
});
