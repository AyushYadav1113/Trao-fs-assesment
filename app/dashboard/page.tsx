"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridBackground } from "@/components/ui/grid-background";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { SearchInput } from "@/components/ui/search-input";
import { GlassCard, GlassCardSkeleton } from "@/components/ui/glass-card";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastSection } from "@/components/ForecastSection";
import { AQICard } from "@/components/AQICard";
import type { WeatherData, ForecastDay, PollutionData } from "@/lib/weather";

// Dynamic import for Leaflet (SSR disabled)
const WeatherMap = dynamic(() => import("@/components/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white/40">
        <div className="w-8 h-8 border-2 border-purple-500/50 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface WeatherState {
  weather: WeatherData | null;
  forecast: ForecastDay[];
  pollution: PollutionData | null;
}

interface RecentSearch {
  city: string;
  timestamp: number;
}

const MAX_RECENT = 5;

function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recent_searches");
    if (stored) {
      setRecent(JSON.parse(stored));
    }
  }, []);

  const addSearch = useCallback((city: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((s) => s.city.toLowerCase() !== city.toLowerCase());
      const updated = [{ city, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem("recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recent, addSearch };
}

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<WeatherState>({
    weather: null,
    forecast: [],
    pollution: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [currentCity, setCurrentCity] = useState("");
  const [favorites, setFavorites] = useState<{ id: string; city: string }[]>([]);
  const [userName, setUserName] = useState<string>("");
  const { recent, addSearch } = useRecentSearches();

  useEffect(() => {
    // Try to get user info from a simple decode of the cookie (display only)
    fetch("/api/auth/me", { method: "GET" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d?.data?.name && setUserName(d.data.name))
      .catch(() => {});

    // Load favorites
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => d.success && setFavorites(d.data))
      .catch(() => {});
  }, []);

  const fetchWeatherData = useCallback(async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes, pollutionRes] = await Promise.allSettled([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
        fetch(`/api/pollution?city=${encodeURIComponent(city)}`),
      ]);

      let weather: WeatherData | null = null;
      let forecast: ForecastDay[] = [];
      let pollution: PollutionData | null = null;

      if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
        const d = await weatherRes.value.json();
        if (d.success) weather = d.data;
        else throw new Error(d.error);
      } else if (weatherRes.status === "fulfilled") {
        const d = await weatherRes.value.json();
        throw new Error(d.error || "Failed to fetch weather");
      }

      if (forecastRes.status === "fulfilled" && forecastRes.value.ok) {
        const d = await forecastRes.value.json();
        if (d.success) forecast = d.data;
      }

      if (pollutionRes.status === "fulfilled" && pollutionRes.value.ok) {
        const d = await pollutionRes.value.json();
        if (d.success) pollution = d.data;
      }

      if (weather) {
        setState({ weather, forecast, pollution });
        setCurrentCity(weather.city);
        addSearch(weather.city);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [addSearch]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const [weatherRes, forecastRes, pollutionRes] = await Promise.allSettled([
            fetch(`/api/weather?lat=${lat}&lon=${lon}`),
            fetch(`/api/forecast?lat=${lat}&lon=${lon}`),
            fetch(`/api/pollution?lat=${lat}&lon=${lon}`),
          ]);

          let weather: WeatherData | null = null;
          let forecast: ForecastDay[] = [];
          let pollution: PollutionData | null = null;

          if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
            const d = await weatherRes.value.json();
            if (d.success) weather = d.data;
          }
          if (forecastRes.status === "fulfilled" && forecastRes.value.ok) {
            const d = await forecastRes.value.json();
            if (d.success) forecast = d.data;
          }
          if (pollutionRes.status === "fulfilled" && pollutionRes.value.ok) {
            const d = await pollutionRes.value.json();
            if (d.success) pollution = d.data;
          }

          if (weather) {
            setState({ weather, forecast, pollution });
            setCurrentCity(weather.city);
            addSearch(weather.city);
          }
        } catch {
          setError("Failed to fetch weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please search for a city manually.");
        setLoading(false);
      }
    );
  };

  const handleToggleFavorite = async () => {
    if (!state.weather) return;

    const existing = favorites.find(
      (f) => f.city.toLowerCase() === state.weather!.city.toLowerCase()
    );

    if (existing) {
      await fetch(`/api/favorites?id=${existing.id}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
    } else {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: state.weather.city,
          country: state.weather.country,
          lat: state.weather.lat,
          lon: state.weather.lon,
        }),
      });
      const d = await res.json();
      if (d.success) setFavorites((prev) => [...prev, d.data]);
    }
  };

  const isFavorite = state.weather
    ? favorites.some((f) => f.city.toLowerCase() === state.weather!.city.toLowerCase())
    : false;

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <GridBackground containerClassName="min-h-screen">
      <BackgroundBeams className="opacity-30" />

      <FloatingNavbar
        navItems={navItems}
        showLogout
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
            {userName ? `Welcome back, ${userName.split(" ")[0]}! 👋` : "Weather Dashboard"}
          </h1>
          <p className="text-white/40 text-xs sm:text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Search section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <GlassCard className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex-1 w-full">
                <SearchInput
                  placeholder="Search city (e.g., London, Tokyo, New York...)"
                  onSearch={fetchWeatherData}
                  loading={loading}
                />
              </div>

              <button
                onClick={handleDetectLocation}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-200 text-sm whitespace-nowrap disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">My Location</span>
                <span className="sm:hidden">Location</span>
              </button>
            </div>

            {/* Recent searches & favorites */}
            {(recent.length > 0 || favorites.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {favorites.length > 0 && (
                  <>
                    <span className="text-white/30 text-[10px] sm:text-xs self-center">⭐ Favorites:</span>
                    {favorites.slice(0, 3).map((fav) => (
                      <button
                        key={fav.id}
                        onClick={() => fetchWeatherData(fav.city)}
                        className="px-2 sm:px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400/80 hover:text-yellow-400 hover:bg-yellow-400/20 text-[10px] sm:text-xs transition-all"
                      >
                        {fav.city}
                      </button>
                    ))}
                  </>
                )}
                {recent.length > 0 && (
                  <>
                    <span className="text-white/30 text-[10px] sm:text-xs self-center ml-2">🕐 Recent:</span>
                    {recent.slice(0, 3).map((s) => (
                      <button
                        key={s.timestamp}
                        onClick={() => fetchWeatherData(s.city)}
                        className="px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 text-[10px] sm:text-xs transition-all"
                      >
                        {s.city}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400/50 hover:text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeletons */}
        {loading && !state.weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCardSkeleton className="h-96" />
            </div>
            <div>
              <GlassCardSkeleton className="h-96" />
            </div>
            <div className="lg:col-span-3">
              <GlassCardSkeleton className="h-48" />
            </div>
          </div>
        )}

        {/* Weather data */}
        <AnimatePresence mode="wait">
          {state.weather && (
            <motion.div
              key={currentCity}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Main weather grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Current weather - takes 2 cols */}
                <div className="lg:col-span-2">
                  <CurrentWeatherCard
                    weather={state.weather}
                    pollution={state.pollution}
                    isCelsius={isCelsius}
                    onToggleUnit={() => setIsCelsius(!isCelsius)}
                    onAddFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                  />
                </div>

                {/* AQI Card */}
                <div>
                  {state.pollution ? (
                    <AQICard pollution={state.pollution} />
                  ) : (
                    <GlassCard animate delay={0.2} className="p-6 flex items-center justify-center h-full">
                      <p className="text-white/30 text-sm text-center">
                        Air quality data unavailable for this location.
                      </p>
                    </GlassCard>
                  )}
                </div>
              </div>

              {/* 5-Day Forecast */}
              {state.forecast.length > 0 && (
                <GlassCard animate delay={0.3} className="p-4 sm:p-6">
                  <ForecastSection forecast={state.forecast} isCelsius={isCelsius} />
                </GlassCard>
              )}

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="flex items-center gap-2">
                      <span>🗺️</span>
                      Location Map
                    </span>
                    <span className="sm:ml-auto text-white/40 text-xs sm:text-sm font-normal">
                      {state.weather.city}, {state.weather.country}
                    </span>
                  </h3>
                  <div className="h-64 sm:h-72 rounded-xl overflow-hidden">
                    <WeatherMap
                      lat={state.weather.lat}
                      lon={state.weather.lon}
                      city={state.weather.city}
                      temperature={isCelsius ? state.weather.temperature : Math.round((state.weather.temperature * 9) / 5 + 32)}
                      condition={state.weather.condition}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!state.weather && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16 sm:py-24 px-4"
          >
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🌤️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              Search for any city
            </h2>
            <p className="text-white/40 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              Enter a city name above to get real-time weather data, 5-day forecasts,
              air quality index, and an interactive map.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {["London", "Tokyo", "New York", "Sydney", "Paris"].map((city) => (
                <button
                  key={city}
                  onClick={() => fetchWeatherData(city)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all text-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </GridBackground>
  );
}
