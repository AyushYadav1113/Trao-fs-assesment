"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  const beamsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = beamsRef.current;
    if (!svg) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      svg.style.setProperty("--x", `${x}px`);
      svg.style.setProperty("--y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <svg
        ref={beamsRef}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="beam1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="beam2" cx="80%" cy="80%" r="60%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="beam3" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#beam1)" />
        <rect width="100%" height="100%" fill="url(#beam2)" />
        <rect width="100%" height="100%" fill="url(#beam3)" />
      </svg>

      {/* Animated gradient orbs — increased opacity for visibility */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", animationDelay: "2s" }}
      />
    </div>
  );
}
