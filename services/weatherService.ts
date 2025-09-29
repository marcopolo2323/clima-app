/**
 * SERVICIO PRINCIPAL DE CLIMA
 * ==========================
 * 
 * Este archivo contiene:
 * - Interfaces TypeScript para todos los datos meteorológicos
 * - Clase WeatherService que unifica múltiples APIs de clima
 * - Mapeo de códigos meteorológicos a descripciones e íconos
 * - Configuración de proveedores (Open-Meteo por defecto, OpenWeather opcional)
 * 
 * Arquitectura de proveedores:
 * - Por defecto usa Open-Meteo (gratuito, sin API key)
 * - Alternativamente puede usar OpenWeather con API key
 * - Cambio de proveedor via variables de entorno sin modificar código
 * 
 * Datos soportados:
 * - Clima actual (temperatura, humedad, viento, presión, UV, etc.)
 * - Pronóstico de 7 días con máximas/mínimas
 * - Pronóstico por horas (24 horas)
 * - Amanecer/atardecer
 */

export interface WeatherData {
  temperature: number;        // Temperatura actual en grados Celsius
  feelsLike?: number;         // Sensación térmica
  humidity: number;           // Humedad relativa (0-100%)
  windSpeed: number;          // Velocidad del viento en km/h
  windDirection: number;      // Dirección del viento en grados (0-360)
  pressure: number;           // Presión atmosférica en hPa
  visibility: number;         // Visibilidad en metros
  uvIndex: number;            // Índice UV (0-11+)
  weatherCode: number;        // Código meteorológico (Open-Meteo)
  description: string;        // Descripción del clima en español
  icon: string;               // Nombre del ícono SF Symbol
  sunrise?: string;           // Amanecer en formato ISO string
  sunset?: string;            // Atardecer en formato ISO string
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

export interface HourlyData {
  time: string; // ISO or YYYY-MM-DDTHH:00
  hourLabel: string; // e.g., 10:00
  temperature: number;
  precipitationProb: number; // 0-100
  weatherCode: number;
  icon: string;
}

export interface LocationData {
  latitude: number;      // Latitud en grados decimales
  longitude: number;     // Longitud en grados decimales
  city?: string;         // Nombre de la ciudad (opcional)
  country?: string;      // Nombre del país (opcional)
  name?: string;         // Nombre completo de la ubicación (opcional, para compatibilidad)
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
  // Configuración de proveedores de clima
  private static readonly BASE_URL = 'https://api.open-meteo.com/v1';
  private static readonly USE_OPENWEATHER = process.env.EXPO_PUBLIC_USE_OPENWEATHER === '1';
  private static readonly OPENWEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY || '';

  /**
   * Obtiene el clima actual para una ubicación específica
   * @param latitude Latitud de la ubicación
   * @param longitude Longitud de la ubicación
   * @returns Datos del clima actual
   */
  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Usar OpenWeather si está configurado, sino usar Open-Meteo por defecto
      if (this.USE_OPENWEATHER && this.OPENWEATHER_KEY) {
        const { owGetCurrentWeather } = await import('./providers/openWeather');
        return await owGetCurrentWeather(latitude, longitude, this.OPENWEATHER_KEY);
      }
      const url = `${this.BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index,weather_code,precipitation,rain,showers,snowfall,cloud_cover,is_day,apparent_temperature&daily=sunrise,sunset&timezone=auto`;
      
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

      // Ajuste defensivo de descripción/ícono si hay precipitación o nubosidad alta
      let description = WEATHER_DESCRIPTIONS[weatherCode] || 'Desconocido';
      let icon = WEATHER_ICONS[weatherCode] || 'questionmark.circle.fill';

      const precipitation = Number(current.precipitation ?? 0);
      const rain = Number(current.rain ?? 0);
      const showers = Number(current.showers ?? 0);
      const snowfall = Number(current.snowfall ?? 0);
      const cloudCover = Number(current.cloud_cover ?? 0);

      if (snowfall > 0) {
        description = 'Nieve';
        icon = WEATHER_ICONS[71];
      } else if (rain > 0 || showers > 0 || precipitation > 0) {
        description = 'Lluvia';
        icon = WEATHER_ICONS[63];
      } else if (cloudCover >= 85 && (weatherCode === 0 || weatherCode === 1)) {
        description = 'Nublado';
        icon = WEATHER_ICONS[3];
      }

      return {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        pressure: current.surface_pressure,
        visibility: current.visibility,
        uvIndex: current.uv_index,
        weatherCode,
        description,
        icon,
        feelsLike: Math.round(current.apparent_temperature),
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error(`No se pudo obtener el clima actual: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getForecast(latitude: number, longitude: number, days: number = 7): Promise<ForecastData[]> {
    try {
      if (this.USE_OPENWEATHER && this.OPENWEATHER_KEY) {
        const { owGetForecast } = await import('./providers/openWeather');
        const out = await owGetForecast(latitude, longitude, days, this.OPENWEATHER_KEY);
        // rellenar descripción/icon con nuestros mapas
        return out.map(f => ({
          ...f,
          description: WEATHER_DESCRIPTIONS[f.weatherCode] || 'Desconocido',
          icon: WEATHER_ICONS[f.weatherCode] || 'questionmark.circle.fill',
        }));
      }
      const response = await fetch(
        `${this.BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener pronóstico del clima');
      }

      const data = await response.json();
      const daily = data.daily;

      // Obtener la fecha actual del dispositivo
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      return daily.time.map((date: string, index: number) => {
        const weatherCode = daily.weather_code[index];
        
        // Adelantar un día para que las fechas coincidan correctamente
        const adjustedDate = new Date(today);
        adjustedDate.setDate(today.getDate() + index + 1);
        const forecastDateString = `${adjustedDate.getFullYear()}-${String(adjustedDate.getMonth() + 1).padStart(2, '0')}-${String(adjustedDate.getDate()).padStart(2, '0')}`;

        console.log(`📅 Fecha API: ${date}, Fecha Original: ${date}, Fecha Ajustada: ${forecastDateString}, Índice: ${index}`);

        return {
          date: forecastDateString,
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

  static async getHourly(latitude: number, longitude: number, hours: number = 12): Promise<HourlyData[]> {
    try {
      if (this.USE_OPENWEATHER && this.OPENWEATHER_KEY) {
        const { owGetHourly } = await import('./providers/openWeather');
        return await owGetHourly(latitude, longitude, hours, this.OPENWEATHER_KEY);
      }

      // Open-Meteo hourly fallback
      const response = await fetch(
        `${this.BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weather_code&timezone=America%2FLima&forecast_hours=${Math.max(
          hours,
          12
        )}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener pronóstico por horas');
      }

      const data = await response.json();
      const hourly = data.hourly;

      const out: HourlyData[] = hourly.time.slice(0, hours).map((t: string, i: number) => {
        const date = new Date(t);
        const hourLabel = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const weatherCode = Number(hourly.weather_code?.[i] ?? 0);
        return {
          time: t,
          hourLabel,
          temperature: Math.round(Number(hourly.temperature_2m?.[i] ?? 0)),
          precipitationProb: Number(hourly.precipitation_probability?.[i] ?? 0),
          weatherCode,
          icon: WEATHER_ICONS[weatherCode] || 'questionmark.circle.fill',
        };
      });
      return out;
    } catch (error) {
      console.error('Error fetching hourly:', error);
      throw new Error('No se pudo obtener el pronóstico por horas');
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

