"use client";
import React from "react";

const weatherIcons: Record<string, string> = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

interface WeatherIconProps {
  code: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WeatherIcon({ code, size = "md", className = "" }: WeatherIconProps) {
  const sizeMap = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl",
  };

  const emoji = weatherIcons[code] || "🌤️";

  return (
    <span
      className={`${sizeMap[size]} leading-none select-none ${className}`}
      role="img"
      aria-label={`Weather: ${code}`}
    >
      {emoji}
    </span>
  );
}

export function WeatherIconImg({ code, size = 50 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://openweathermap.org/img/wn/${code}@2x.png`}
      alt={`Weather icon ${code}`}
      width={size}
      height={size}
      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
    />
  );
}
