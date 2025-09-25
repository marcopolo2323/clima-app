import type { ForecastData, WeatherData } from '../weatherService';

// Mapear códigos de OpenWeather (weather[0].id) a códigos de Open-Meteo que ya usa la app
function mapOpenWeatherToOpenMeteoCode(openWeatherId: number): number {
  // Referencias OW: https://openweathermap.org/weather-conditions
  if (openWeatherId >= 200 && openWeatherId < 300) {
    // Tormentas
    return 95;
  }
  if (openWeatherId >= 300 && openWeatherId < 400) {
    // Llovizna
    return 51;
  }
  if (openWeatherId >= 500 && openWeatherId < 600) {
    // Lluvia
    if (openWeatherId >= 500 && openWeatherId <= 504) return 61; // ligera a moderada
    if (openWeatherId === 511) return 96; // lluvia helada ~ granizo ligero
    if (openWeatherId >= 520) return 80; // chubascos
    return 63;
  }
  if (openWeatherId >= 600 && openWeatherId < 700) {
    // Nieve
    if (openWeatherId === 600) return 71;
    if (openWeatherId === 601) return 73;
    return 75;
  }
  if (openWeatherId >= 700 && openWeatherId < 800) {
    // Niebla, polvo, etc.
    return 45;
  }
  if (openWeatherId === 800) {
    // Despejado
    return 0;
  }
  if (openWeatherId === 801) {
    // Pocas nubes
    return 1;
  }
  if (openWeatherId === 802) {
    // Parcialmente nublado
    return 2;
  }
  if (openWeatherId === 803 || openWeatherId === 804) {
    // Nublado
    return 3;
  }
  return 3;
}

function toDateStringFromUnixSeconds(unixSeconds: number): string {
  // OW entrega dt en segundos UTC; representamos fecha local del dispositivo en YYYY-MM-DD
  const d = new Date(unixSeconds * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function owGetCurrentWeather(
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenWeather current error: ${res.status} - ${txt}`);
  }
  const data = await res.json();

  const weatherId: number = data.weather?.[0]?.id ?? 800;
  const mappedCode = mapOpenWeatherToOpenMeteoCode(weatherId);

  const windSpeed = Number(data.wind?.speed ?? 0) * 3.6; // m/s -> km/h
  const windDeg = Number(data.wind?.deg ?? 0);
  const pressure = Number(data.main?.pressure ?? 0);
  const humidity = Number(data.main?.humidity ?? 0);
  const visibility = Number(data.visibility ?? 0);
  const temperature = Math.round(Number(data.main?.temp ?? 0));
  const feelsLike = Math.round(Number(data.main?.feels_like ?? temperature));

  // Sunrise/Sunset (segundos UTC) vienen en sys
  const sunrise = data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toISOString() : undefined;
  const sunset = data.sys?.sunset ? new Date(data.sys.sunset * 1000).toISOString() : undefined;

  // OpenWeather no provee UV aquí. Lo dejamos en 0 para consistencia.
  const uvIndex = 0;

  return {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    windDirection: windDeg,
    pressure,
    visibility,
    uvIndex,
    weatherCode: mappedCode,
    description: String(data.weather?.[0]?.description ?? 'Desconocido'),
    icon: 'questionmark.circle.fill',
    sunrise,
    sunset,
  };
}

export async function owGetForecast(
  latitude: number,
  longitude: number,
  days: number,
  apiKey: string,
): Promise<ForecastData[]> {
  // Usamos One Call para obtener daily. Requiere plan; si falla, hacemos fallback.
  const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric&lang=es`;

  try {
    const res = await fetch(oneCallUrl, { method: 'GET' });
    if (!res.ok) throw new Error(`OpenWeather onecall error: ${res.status}`);
    const data = await res.json();

    const daily: any[] = Array.isArray(data.daily) ? data.daily : [];
    const out: ForecastData[] = daily.slice(0, days).map((d) => {
      const weatherId: number = d.weather?.[0]?.id ?? 800;
      const mappedCode = mapOpenWeatherToOpenMeteoCode(weatherId);
      const date = toDateStringFromUnixSeconds(Number(d.dt));
      const maxTemp = Math.round(Number(d.temp?.max ?? 0));
      const minTemp = Math.round(Number(d.temp?.min ?? 0));
      const precipitation = Number(d.rain ?? d.snow ?? 0);
      const windSpeed = Number(d.wind_speed ?? 0) * 3.6; // m/s -> km/h

      return {
        date,
        maxTemp,
        minTemp,
        weatherCode: mappedCode,
        description: String(d.weather?.[0]?.description ?? 'Desconocido'),
        icon: 'questionmark.circle.fill',
        precipitation,
        windSpeed,
      };
    });
    if (out.length) return out;
    throw new Error('OpenWeather daily vacío');
  } catch (e) {
    // Fallback: usar /forecast de 5 días/3 horas y agregamos por fecha
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenWeather forecast error: ${res.status} - ${txt}`);
    }
    const data = await res.json();
    const list: any[] = Array.isArray(data.list) ? data.list : [];

    const byDate: Record<string, { max: number; min: number; wind: number; precip: number; code: number; desc: string }>= {};
    for (const entry of list) {
      const dt = Number(entry.dt);
      const dateStr = toDateStringFromUnixSeconds(dt);
      const temp = Number(entry.main?.temp ?? 0);
      const wind = Number(entry.wind?.speed ?? 0) * 3.6;
      const rain = Number(entry.rain?.['3h'] ?? 0);
      const snow = Number(entry.snow?.['3h'] ?? 0);
      const precip = rain + snow;
      const weatherId: number = entry.weather?.[0]?.id ?? 800;
      const code = mapOpenWeatherToOpenMeteoCode(weatherId);
      const desc = String(entry.weather?.[0]?.description ?? 'Desconocido');

      if (!byDate[dateStr]) {
        byDate[dateStr] = { max: temp, min: temp, wind, precip, code, desc };
      } else {
        byDate[dateStr].max = Math.max(byDate[dateStr].max, temp);
        byDate[dateStr].min = Math.min(byDate[dateStr].min, temp);
        byDate[dateStr].wind = Math.max(byDate[dateStr].wind, wind);
        byDate[dateStr].precip += precip;
        // Preferimos código más severo (tormenta > lluvia > nubes > despejado)
        byDate[dateStr].code = Math.max(byDate[dateStr].code, code);
        byDate[dateStr].desc = desc;
      }
    }

    const dates = Object.keys(byDate).sort();
    const out: ForecastData[] = dates.slice(0, days).map((d) => ({
      date: d,
      maxTemp: Math.round(byDate[d].max),
      minTemp: Math.round(byDate[d].min),
      weatherCode: byDate[d].code,
      description: byDate[d].desc,
      icon: 'questionmark.circle.fill',
      precipitation: byDate[d].precip,
      windSpeed: byDate[d].wind,
    }));
    return out;
  }
}

export async function owGetHourly(
  latitude: number,
  longitude: number,
  hours: number,
  apiKey: string,
): Promise<import('../weatherService').HourlyData[]> {
  // 5 day / 3 hour forecast gives granularity; for hourly next 12h we can use this and expand labels
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenWeather hourly error: ${res.status} - ${txt}`);
  }
  const data = await res.json();
  const list: any[] = Array.isArray(data.list) ? data.list : [];

  const out = list.slice(0, hours).map((entry) => {
    const dt = Number(entry.dt);
    const date = new Date(dt * 1000);
    const hourLabel = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const temp = Math.round(Number(entry.main?.temp ?? 0));
    const pop = Math.round(Number(entry.pop ?? 0) * 100);
    const weatherId: number = entry.weather?.[0]?.id ?? 800;
    const code = mapOpenWeatherToOpenMeteoCode(weatherId);
    return {
      time: date.toISOString(),
      hourLabel,
      temperature: temp,
      precipitationProb: pop,
      weatherCode: code,
      icon: 'questionmark.circle.fill',
    };
  });
  return out;
}


const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

function mapWeatherCodeToOurCode(owId: number): number {
  if (owId >= 200 && owId < 300) return 95; // tormenta
  if (owId >= 300 && owId < 400) return 51; // llovizna
  if (owId >= 500 && owId < 600) return 63; // lluvia
  if (owId >= 600 && owId < 700) return 73; // nieve
  if (owId === 741) return 45; // niebla
  if (owId === 800) return 0; // despejado
  if (owId > 800) return 2; // nubes
  return 2;
}

export async function owGetCurrentWeather(latitude: number, longitude: number, apiKey: string): Promise<WeatherData> {
  const url = `${OPENWEATHER_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OpenWeather error ${res.status}`);
  }
  const data = await res.json();
  const owId = data.weather?.[0]?.id ?? 800;
  const ourCode = mapWeatherCodeToOurCode(owId);

  return {
    temperature: Math.round(data.main.temp),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s -> km/h
    windDirection: data.wind.deg ?? 0,
    pressure: data.main.pressure,
    visibility: data.visibility ?? 10000,
    uvIndex: 0,
    weatherCode: ourCode,
    description: data.weather?.[0]?.description ?? 'Desconocido',
    icon: 'questionmark.circle.fill',
  };
}

export async function owGetForecast(latitude: number, longitude: number, days: number, apiKey: string): Promise<ForecastData[]> {
  const url = `${OPENWEATHER_BASE}/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=es`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OpenWeather forecast error ${res.status}`);
  }
  const data = await res.json();
  const list = data.list as any[];
  const byDate: Record<string, { max: number; min: number; precip: number; wind: number; code: number } > = {};
  for (const item of list) {
    const date = new Date((item.dt + data.city.timezone) * 1000);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    const temp = item.main.temp as number;
    const rain = (item.rain?.['3h'] ?? 0) as number;
    const wind = (item.wind?.speed ?? 0) as number;
    const code = mapWeatherCodeToOurCode(item.weather?.[0]?.id ?? 800);
    if (!byDate[key]) {
      byDate[key] = { max: temp, min: temp, precip: 0, wind: 0, code };
    }
    byDate[key].max = Math.max(byDate[key].max, temp);
    byDate[key].min = Math.min(byDate[key].min, temp);
    byDate[key].precip += rain;
    byDate[key].wind = Math.max(byDate[key].wind, wind * 3.6);
    // priorizar códigos de lluvia/tormenta
    if (code >= 61 || code === 95) byDate[key].code = code;
  }

  const dates = Object.keys(byDate).sort();
  const out: ForecastData[] = [];
  for (const key of dates.slice(0, days)) {
    const v = byDate[key];
    out.push({
      date: key,
      maxTemp: Math.round(v.max),
      minTemp: Math.round(v.min),
      weatherCode: v.code,
      description: '',
      icon: '',
      precipitation: Number(v.precip.toFixed(1)),
      windSpeed: Math.round(v.wind),
    });
  }
  return out;
}


