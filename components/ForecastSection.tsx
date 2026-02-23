"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { WeatherIconImg } from "@/components/WeatherIcon";
import type { ForecastDay } from "@/lib/weather";

interface ForecastSectionProps {
  forecast: ForecastDay[];
  isCelsius: boolean;
}

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

export function ForecastSection({ forecast, isCelsius }: ForecastSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const unit = isCelsius ? "°C" : "°F";

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📅</span>
          5-Day Forecast
        </h3>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Responsive scroller: horizontal on small screens, wrapped/justified on >=sm */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar px-2 sm:overflow-visible sm:flex-wrap sm:justify-between"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {forecast.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex-shrink-0 w-40 sm:flex-1 sm:max-w-[12rem] md:max-w-[14rem]"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-4 text-center hover:bg-white/8 hover:border-purple-500/30 transition-all duration-200 cursor-default">
              <p className="text-white/50 text-xs font-medium mb-2 sm:mb-3">{day.date}</p>

              <div className="flex justify-center mb-2 sm:mb-3">
                <WeatherIconImg code={day.icon} size={44} />
              </div>

              <p className="text-white/60 text-xs capitalize mb-2 sm:mb-3 leading-tight">
                {day.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-white font-semibold">
                  {isCelsius ? day.tempMax : toF(day.tempMax)}{unit}
                </span>
                <span className="text-white/40">
                  {isCelsius ? day.tempMin : toF(day.tempMin)}{unit}
                </span>
              </div>

              {day.pop > 0 && (
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-400">
                  <span>🌧</span>
                  <span>{day.pop}%</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
