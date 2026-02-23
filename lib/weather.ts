const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const API_KEY = process.env.OPENWEATHER_API_KEY;

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface ForecastDay {
  date: string;
  dateTimestamp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation
}

export interface PollutionData {
  aqi: number;
  aqiLabel: string;
  aqiColor: string;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface GeoLocation {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

function getAQIInfo(aqi: number): { label: string; color: string } {
  switch (aqi) {
    case 1: return { label: "Good", color: "#22c55e" };
    case 2: return { label: "Fair", color: "#84cc16" };
    case 3: return { label: "Moderate", color: "#eab308" };
    case 4: return { label: "Poor", color: "#f97316" };
    case 5: return { label: "Very Poor", color: "#ef4444" };
    default: return { label: "Unknown", color: "#6b7280" };
  }
}

export async function geocodeCity(city: string): Promise<GeoLocation | null> {
  if (!API_KEY) throw new Error("OpenWeather API key not configured");

  const res = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();
  if (!data || data.length === 0) return null;

  return {
    name: data[0].name,
    country: data[0].country,
    state: data[0].state,
    lat: data[0].lat,
    lon: data[0].lon,
  };
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY) throw new Error("OpenWeather API key not configured");

  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) throw new Error("Weather request failed");

  const data = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
    visibility: data.visibility / 1000, // Convert to km
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
  };
}

export async function getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  if (!API_KEY) throw new Error("OpenWeather API key not configured");

  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) throw new Error("Forecast request failed");

  const data = await res.json();

  // Group by day and get daily summary
  const dailyMap = new Map<string, { temps: number[]; items: typeof data.list }>();

  data.list.forEach((item: {
    dt: number;
    main: { temp: number; humidity: number };
    weather: Array<{ main: string; description: string; icon: string }>;
    wind: { speed: number };
    pop: number;
  }) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, { temps: [], items: [] });
    }

    const entry = dailyMap.get(date)!;
    entry.temps.push(item.main.temp);
    entry.items.push(item);
  });

  const forecast: ForecastDay[] = [];
  let dayCount = 0;

  for (const [date, { temps, items }] of dailyMap) {
    if (dayCount >= 5) break;

    const midday = items[Math.floor(items.length / 2)];

    forecast.push({
      date,
      dateTimestamp: items[0].dt,
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      condition: midday.weather[0].main,
      description: midday.weather[0].description,
      icon: midday.weather[0].icon,
      humidity: midday.main.humidity,
      windSpeed: midday.wind.speed,
      pop: Math.round(midday.pop * 100),
    });

    dayCount++;
  }

  return forecast;
}

export async function getAirPollution(lat: number, lon: number): Promise<PollutionData> {
  if (!API_KEY) throw new Error("OpenWeather API key not configured");

  const res = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) throw new Error("Pollution request failed");

  const data = await res.json();
  const current = data.list[0];
  const aqi = current.main.aqi;
  const aqiInfo = getAQIInfo(aqi);

  return {
    aqi,
    aqiLabel: aqiInfo.label,
    aqiColor: aqiInfo.color,
    components: current.components,
  };
}
