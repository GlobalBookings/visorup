type Coord = { latitude: number; longitude: number };

export type WeatherPoint = {
  latitude: number;
  longitude: number;
  temperature: number; // celsius
  condition: 'clear' | 'cloud' | 'rain' | 'drizzle' | 'snow' | 'fog' | 'wind';
  windSpeed: number; // mph
  description: string;
};

// Uses Open-Meteo free API (no key needed)
export async function getRouteWeather(waypoints: Coord[]): Promise<WeatherPoint[]> {
  if (waypoints.length === 0) return [];

  // Sample up to 5 points along the route for weather
  const step = Math.max(1, Math.floor(waypoints.length / 5));
  const samplePoints = waypoints.filter((_, i) => i % step === 0).slice(0, 5);

  const results: WeatherPoint[] = [];

  for (const point of samplePoints) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${point.latitude}&longitude=${point.longitude}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=mph`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.current) {
        results.push({
          latitude: point.latitude,
          longitude: point.longitude,
          temperature: Math.round(data.current.temperature_2m),
          condition: weatherCodeToCondition(data.current.weather_code),
          windSpeed: Math.round(data.current.wind_speed_10m),
          description: weatherCodeToDescription(data.current.weather_code),
        });
      }
    } catch (_) {}
  }

  return results;
}

function weatherCodeToCondition(code: number): WeatherPoint['condition'] {
  if (code === 0 || code === 1) return 'clear';
  if (code >= 2 && code <= 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 95) return 'rain';
  return 'cloud';
}

function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code === 66 || code === 67) return 'Freezing rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

export function getWeatherIcon(condition: WeatherPoint['condition']): string {
  switch (condition) {
    case 'clear': return 'sunny-outline';
    case 'cloud': return 'cloud-outline';
    case 'rain': return 'rainy-outline';
    case 'drizzle': return 'rainy-outline';
    case 'snow': return 'snow-outline';
    case 'fog': return 'cloud-outline';
    case 'wind': return 'flag-outline';
    default: return 'cloud-outline';
  }
}

export function getWeatherColor(condition: WeatherPoint['condition']): string {
  switch (condition) {
    case 'clear': return '#FFC107';
    case 'cloud': return '#90A4AE';
    case 'rain': return '#42A5F5';
    case 'drizzle': return '#64B5F6';
    case 'snow': return '#E3F2FD';
    case 'fog': return '#78909C';
    case 'wind': return '#26C6DA';
    default: return '#90A4AE';
  }
}
