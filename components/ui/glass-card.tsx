"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "purple" | "blue" | "green" | "orange" | "none";
  animate?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = "none",
  animate = false,
  delay = 0,
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    purple: "hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:border-purple-500/30",
    blue: "hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:border-blue-500/30",
    green: "hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:border-green-500/30",
    orange: "hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:border-orange-500/30",
  };

  const card = (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "backdrop-blur-xl",
        "border border-white/[0.12]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
        hover && "transition-all duration-300 cursor-pointer",
        hover && glowStyles[glow],
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
      }}
    >
      {/* Top-edge highlight sheen */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      >
        {card}
      </motion.div>
    );
  }

  return card;
}

export function GlassCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl backdrop-blur-xl border border-white/[0.12] overflow-hidden",
        className
      )}
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)" }}
    >
      <div className="animate-pulse p-6 space-y-4">
        <div className="h-4 bg-white/10 rounded-full w-3/4" />
        <div className="h-10 bg-white/10 rounded-xl w-1/2" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-white/10 rounded-xl" />
          <div className="h-16 bg-white/10 rounded-xl" />
          <div className="h-16 bg-white/10 rounded-xl" />
          <div className="h-16 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
