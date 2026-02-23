"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function GridBackground({
  children,
  className,
  containerClassName,
}: GridBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen bg-black", containerClassName)}>
      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          "[background-size:64px_64px]",
          "[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"
        )}
      />

      {/* Radial gradient overlay — fade grid toward edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

export function DotBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-screen bg-black",
        "[background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]",
        "[background-size:24px_24px]",
        className
      )}
    >
      {children}
    </div>
  );
}
