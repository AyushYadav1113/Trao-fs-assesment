"use client";
import React, { useEffect, useRef } from "react";

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
  temperature: number;
  condition: string;
}

export default function WeatherMap({ lat, lon, city, temperature, condition }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [lat, lon],
          zoom: 10,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            maxZoom: 18,
          }
        ).addTo(mapInstanceRef.current);

        const customIcon = L.divIcon({
          html: `
            <div style="
              background: linear-gradient(135deg, #7c3aed, #2563eb);
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 16px;">🌤</span>
            </div>
          `,
          className: "",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        markerRef.current = L.marker([lat, lon], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<div style="color: #1a1a1a; font-family: sans-serif;">
              <strong>${city}</strong><br/>
              ${temperature}°C | ${condition}
            </div>`,
            { className: "custom-popup" }
          )
          .openPopup();
      } else if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([lat, lon], 10);
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current
          .getPopup()
          ?.setContent(
            `<div style="color: #1a1a1a; font-family: sans-serif;">
              <strong>${city}</strong><br/>
              ${temperature}°C | ${condition}
            </div>`
          );
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lon, city, temperature, condition]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "250px" }}
    />
  );
}
