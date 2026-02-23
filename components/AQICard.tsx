"use client";
import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import type { PollutionData } from "@/lib/weather";

interface AQICardProps {
  pollution: PollutionData;
}

const pollutantInfo: Record<string, { label: string; unit: string; icon: string }> = {
  co: { label: "CO", unit: "μg/m³", icon: "🏭" },
  no2: { label: "NO₂", unit: "μg/m³", icon: "🚗" },
  o3: { label: "O₃", unit: "μg/m³", icon: "🌿" },
  so2: { label: "SO₂", unit: "μg/m³", icon: "⚗️" },
  pm2_5: { label: "PM2.5", unit: "μg/m³", icon: "🌫️" },
  pm10: { label: "PM10", unit: "μg/m³", icon: "💨" },
};

export function AQICard({ pollution }: AQICardProps) {
  const aqiPercentage = (pollution.aqi / 5) * 100;

  return (
    <GlassCard animate glow="blue" delay={0.2} className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <span>🌬️</span>
        Air Quality Index
      </h3>

      {/* AQI Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl font-bold" style={{ color: pollution.aqiColor }}>
            {pollution.aqi}
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${pollution.aqiColor}20`,
              color: pollution.aqiColor,
            }}
          >
            {pollution.aqiLabel}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${aqiPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, ${pollution.aqiColor})`,
            }}
          />
        </div>

        <div className="flex justify-between mt-1 text-xs text-white/30">
          <span>Good</span>
          <span>Fair</span>
          <span>Moderate</span>
          <span>Poor</span>
          <span>Very Poor</span>
        </div>
      </div>

      {/* Pollutants grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(pollutantInfo).map(([key, info]) => {
          const value = pollution.components[key as keyof typeof pollution.components];
          return (
            <div
              key={key}
              className="bg-white/5 rounded-xl p-2 sm:p-3 text-center"
            >
              <span className="text-base sm:text-lg">{info.icon}</span>
              <p className="text-white/40 text-[10px] sm:text-xs mt-1">{info.label}</p>
              <p className="text-white text-xs font-semibold mt-0.5">
                {value?.toFixed(1)}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
