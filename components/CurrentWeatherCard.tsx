"use client";
import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { WeatherIconImg } from "@/components/WeatherIcon";
import type { WeatherData } from "@/lib/weather";
import type { PollutionData } from "@/lib/weather";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  pollution: PollutionData | null;
  isCelsius: boolean;
  onToggleUnit: () => void;
  onAddFavorite?: () => void;
  isFavorite?: boolean;
}

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

function formatTime(timestamp: number, timezone: number) {
  const utc = timestamp + timezone;
  const d = new Date(utc * 1000);
  return d.toISOString().slice(11, 16);
}

export function CurrentWeatherCard({
  weather,
  pollution,
  isCelsius,
  onToggleUnit,
  onAddFavorite,
  isFavorite,
}: CurrentWeatherCardProps) {
  const [iconSize, setIconSize] = React.useState(80);

  React.useEffect(() => {
    const update = () => setIconSize(window.innerWidth < 640 ? 60 : 80);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const temp = isCelsius ? weather.temperature : toF(weather.temperature);
  const feelsLike = isCelsius ? weather.feelsLike : toF(weather.feelsLike);
  const unit = isCelsius ? "°C" : "°F";

  const statItems = [
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: "💧",
    },
    {
      label: "Wind",
      value: `${weather.windSpeed} m/s`,
      icon: "💨",
    },
    {
      label: "Pressure",
      value: `${weather.pressure} hPa`,
      icon: "🌡️",
    },
    {
      label: "Visibility",
      value: `${weather.visibility} km`,
      icon: "👁️",
    },
    {
      label: "Sunrise",
      value: formatTime(weather.sunrise, weather.timezone),
      icon: "🌅",
    },
    {
      label: "Sunset",
      value: formatTime(weather.sunset, weather.timezone),
      icon: "🌇",
    },
  ];

  return (
    <GlassCard animate glow="purple" className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {weather.city}
              <span className="text-white/50 font-normal ml-2 text-sm sm:text-base">
                {weather.country}
              </span>
            </h2>
          </div>
          <p className="text-white/50 text-sm capitalize">{weather.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite button */}
          {onAddFavorite && (
            <button
              onClick={onAddFavorite}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isFavorite
                  ? "text-yellow-400 bg-yellow-400/10"
                  : "text-white/40 hover:text-yellow-400 hover:bg-yellow-400/10"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}

          {/* °C / °F toggle */}
          <button
            onClick={onToggleUnit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm font-medium text-white"
          >
            <span className={isCelsius ? "text-white" : "text-white/40"}>°C</span>
            <span className="text-white/20">/</span>
            <span className={!isCelsius ? "text-white" : "text-white/40"}>°F</span>
          </button>
        </div>
      </div>

      {/* Main temperature display */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
        <motion.div
          key={weather.icon}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <WeatherIconImg code={weather.icon} size={iconSize} />
        </motion.div>

        <div className="w-full">
          <motion.div
            key={`${temp}${unit}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl sm:text-7xl font-bold text-white leading-none"
          >
            {temp}
            <span className="text-2xl sm:text-4xl text-white/60 ml-1">{unit}</span>
          </motion.div>
          <p className="text-white/50 mt-1">
            Feels like <span className="text-white/70">{feelsLike}{unit}</span>
          </p>
        </div>
      </div>

      {/* AQI Badge */}
      {pollution && (
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: `${pollution.aqiColor}20`,
              borderColor: `${pollution.aqiColor}40`,
              border: "1px solid",
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: pollution.aqiColor }}
            />
            <span style={{ color: pollution.aqiColor }}>
              AQI {pollution.aqi} — {pollution.aqiLabel}
            </span>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.2 }}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <span className="text-xl">{stat.icon}</span>
            <div>
              <p className="text-white/40 text-xs">{stat.label}</p>
              <p className="text-white text-sm font-semibold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
