"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { CardHoverEffect } from "@/components/ui/card-hover-effect";

const features = [
  {
    title: "Real-Time Weather",
    description: "Live temperature, humidity, wind speed, pressure, and visibility data from OpenWeather API.",
    icon: "🌤️",
  },
  {
    title: "5-Day Forecast",
    description: "Animated forecast cards with min/max temperatures, precipitation probability, and conditions.",
    icon: "📅",
  },
  {
    title: "Air Quality Index",
    description: "Color-coded AQI with detailed pollutant breakdowns including PM2.5, PM10, NO₂, and ozone.",
    icon: "🌬️",
  },
  {
    title: "Interactive Map",
    description: "Leaflet-powered dark maps with custom markers showing your searched city location.",
    icon: "🗺️",
  },
  {
    title: "Secure Auth",
    description: "JWT authentication with bcrypt password hashing and HTTP-only cookies for maximum security.",
    icon: "🔐",
  },
  {
    title: "Favorite Cities",
    description: "Save and quickly access your favorite cities. Recent searches saved locally for convenience.",
    icon: "⭐",
  },
];

const stats = [
  { value: "200+", label: "Countries Covered" },
  { value: "1M+", label: "Cities Worldwide" },
  { value: "10min", label: "Update Frequency" },
  { value: "99.9%", label: "Uptime SLA" },
];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative min-h-screen bg-black"
      onMouseMove={(e) =>
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    >
      {/* Background layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BackgroundBeams />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            WebkitMaskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 50%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 100% 60% at 50% 0%, black 50%, transparent 100%)",
          }}
        />

        {/* Mouse-follow spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.07), transparent 40%)`,
          }}
        />

        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(139, 92, 246, 0.5)"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-16 py-4 sm:py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <span className="text-white font-bold text-sm sm:text-base">W</span>
          </div>
          <span className="text-white font-bold text-base sm:text-lg">TaroMausam</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/signin">
            <AnimatedButton variant="ghost" size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
              Sign In
            </AnimatedButton>
          </Link>
          <Link href="/signup">
            <AnimatedButton variant="primary" size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
              Get Started
            </AnimatedButton>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-12 sm:pt-16 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm mb-6"
                style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                </span>
                <span>Live Weather Data</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                Your Weather,
                <br />
                <span style={{
                  background: "linear-gradient(to right, #a78bfa, #60a5fa, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Beautifully Simple
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Track real-time weather, air quality, and 5-day forecasts for any city worldwide. 
                Beautiful interface, powerful insights.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <AnimatedButton size="lg" className="w-full sm:w-auto px-8">
                    Get Started Free
                  </AnimatedButton>
                </Link>
                <Link href="/signin">
                  <AnimatedButton variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                    Sign In
                  </AnimatedButton>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">200+</div>
                  <div className="text-xs sm:text-sm text-white/40">Countries</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">1M+</div>
                  <div className="text-xs sm:text-sm text-white/40">Cities</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-xs sm:text-sm text-white/40">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Preview Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Decorative blur */}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              
              <div className="relative">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-white font-semibold text-lg">Tokyo, JP</span>
                      </div>
                      <p className="text-white/40 text-sm">Partly cloudy</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium border"
                      style={{ background: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.3)", color: "#86efac" }}>
                      Good Air
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <span className="text-7xl">⛅</span>
                    <div>
                      <div className="text-6xl font-bold text-white leading-none">
                        22<span className="text-3xl text-white/50">°C</span>
                      </div>
                      <p className="text-white/40 text-sm mt-2">Feels like 19°C</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: "💧", label: "Humidity", value: "68%" },
                      { icon: "💨", label: "Wind", value: "3.2 m/s" },
                      { icon: "🌅", label: "Sunrise", value: "05:47" },
                      { icon: "🌇", label: "Sunset", value: "18:32" },
                    ].map((stat) => (
                      <div key={stat.label}
                        className="rounded-xl p-3 text-center"
                        style={{ background: "rgba(255,255,255,0.07)" }}>
                        <span className="text-xl">{stat.icon}</span>
                        <p className="text-white/40 text-[10px] mt-1">{stat.label}</p>
                        <p className="text-white text-xs font-semibold mt-0.5">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto">
            Everything you need to track weather conditions worldwide
          </p>
        </motion.div>

        <CardHoverEffect items={features} />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-3xl" />
          
          <GlassCard className="relative p-12 sm:p-16 text-center" glow="purple">
            <div className="text-5xl sm:text-6xl mb-6">🌍</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-white/50 mb-10 max-w-2xl mx-auto">
              Join thousands of users tracking weather in real-time. 
              Free to use, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <AnimatedButton size="lg" className="px-10 py-4 text-base">
                  Create Free Account
                </AnimatedButton>
              </Link>
              <Link href="/signin">
                <AnimatedButton variant="ghost" size="lg" className="px-10 py-4 text-base">
                  Sign In
                </AnimatedButton>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/30 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Free Forever</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 sm:py-8 px-4 sm:px-6 text-center text-white/20 text-xs sm:text-sm">
        <p>Built by Ayush Yadav - 7651885203 | ayushyadav212121@gmail.com</p>
      </footer>
    </div>
  );
}
