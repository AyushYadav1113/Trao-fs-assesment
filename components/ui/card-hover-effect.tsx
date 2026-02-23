"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverCardItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  link?: string;
}

interface CardHoverEffectProps {
  items: HoverCardItem[];
  className?: string;
}

export function CardHoverEffect({ items, className }: CardHoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 bg-purple-500/10 rounded-2xl block"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>

          <div 
            className="relative z-10 rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500/30"
          >
            {item.icon && (
              <div className="mb-3 text-3xl">{item.icon}</div>
            )}
            <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
