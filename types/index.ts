export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WeatherSearchResult {
  weather: import("@/lib/weather").WeatherData;
  forecast: import("@/lib/weather").ForecastDay[];
  pollution: import("@/lib/weather").PollutionData;
}
