export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  weatherCode: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  description: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

export interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const WEATHER_ICONS: { [key: number]: string } = {
  0: 'sun.max.fill', // Clear sky
  1: 'sun.max.fill', // Mainly clear
  2: 'cloud.sun.fill', // Partly cloudy
  3: 'cloud.fill', // Overcast
  45: 'cloud.fog.fill', // Fog
  48: 'cloud.fog.fill', // Depositing rime fog
  51: 'cloud.drizzle.fill', // Light drizzle
  53: 'cloud.drizzle.fill', // Moderate drizzle
  55: 'cloud.drizzle.fill', // Dense drizzle
  61: 'cloud.rain.fill', // Slight rain
  63: 'cloud.rain.fill', // Moderate rain
  65: 'cloud.rain.fill', // Heavy rain
  71: 'cloud.snow.fill', // Slight snow
  73: 'cloud.snow.fill', // Moderate snow
  75: 'cloud.snow.fill', // Heavy snow
  77: 'cloud.snow.fill', // Snow grains
  80: 'cloud.rain.fill', // Slight rain showers
  81: 'cloud.rain.fill', // Moderate rain showers
  82: 'cloud.rain.fill', // Violent rain showers
  85: 'cloud.snow.fill', // Slight snow showers
  86: 'cloud.snow.fill', // Heavy snow showers
  95: 'cloud.bolt.fill', // Thunderstorm
  96: 'cloud.bolt.rain.fill', // Thunderstorm with slight hail
  99: 'cloud.bolt.rain.fill', // Thunderstorm with heavy hail
};

const WEATHER_DESCRIPTIONS: { [key: number]: string } = {
  0: 'Cielo despejado',
  1: 'Principalmente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna densa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  71: 'Nieve ligera',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  77: 'Granos de nieve',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos violentos',
  85: 'Chubascos de nieve ligeros',
  86: 'Chubascos de nieve intensos',
  95: 'Tormenta',
  96: 'Tormenta con granizo ligero',
  99: 'Tormenta con granizo intenso',
};

export class WeatherService {
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1';

  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const url = `${this.BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index,weather_code&timezone=auto`;
      
      console.log('Fetching weather from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Error al obtener datos del clima: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Weather data received:', data);
      
      const current = data.current;
      const weatherCode = current.weather_code;

      return {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        pressure: current.surface_pressure,
        visibility: current.visibility,
        uvIndex: current.uv_index,
        weatherCode,
        description: WEATHER_DESCRIPTIONS[weatherCode] || 'Desconocido',
        icon: WEATHER_ICONS[weatherCode] || 'questionmark.circle.fill',
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error(`No se pudo obtener el clima actual: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getForecast(latitude: number, longitude: number, days: number = 7): Promise<ForecastData[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener pronóstico del clima');
      }

      const data = await response.json();
      const daily = data.daily;

      return daily.time.map((date: string, index: number) => {
        const weatherCode = daily.weather_code[index];
        
        // Usar la fecha directamente de la API sin normalización
        // La API ya devuelve fechas en formato YYYY-MM-DD
        return {
          date: date,
          maxTemp: Math.round(daily.temperature_2m_max[index]),
          minTemp: Math.round(daily.temperature_2m_min[index]),
          weatherCode,
          description: WEATHER_DESCRIPTIONS[weatherCode] || 'Desconocido',
          icon: WEATHER_ICONS[weatherCode] || 'questionmark.circle.fill',
          precipitation: daily.precipitation_sum[index],
          windSpeed: daily.wind_speed_10m_max[index],
        };
      });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('No se pudo obtener el pronóstico');
    }
  }

  static async searchLocation(query: string): Promise<LocationData[]> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=es&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Error al buscar ubicación');
      }

      const data = await response.json();
      
      if (!data.results) {
        return [];
      }

      return data.results.map((result: any) => ({
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
      }));
    } catch (error) {
      console.error('Error searching location:', error);
      throw new Error('No se pudo buscar la ubicación');
    }
  }

  static getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  static getUVIndexDescription(uvIndex: number): string {
    if (uvIndex <= 2) return 'Bajo';
    if (uvIndex <= 5) return 'Moderado';
    if (uvIndex <= 7) return 'Alto';
    if (uvIndex <= 10) return 'Muy alto';
    return 'Extremo';
  }
}

