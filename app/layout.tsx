import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AIAssistant } from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: "WeatherVision — Real-Time Weather Forecasting",
  description:
    "A production-ready weather forecasting app with real-time data, 5-day forecasts, air quality index, and interactive maps.",
  keywords: ["weather", "forecast", "air quality", "temperature", "climate"],
  openGraph: {
    title: "WeatherVision",
    description: "Real-Time Weather Forecasting",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-black text-white antialiased">
        <Providers>
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
