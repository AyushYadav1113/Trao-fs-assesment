"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm text-white/70 font-medium">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl py-3 px-4 text-white text-sm",
              "backdrop-blur-sm",
              "border border-white/[0.15]",
              "placeholder:text-white/30",
              "outline-none transition-all duration-200",
              "focus:border-purple-500/60",
              "focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]",
              icon && "pl-10",
              error && "border-red-500/50 focus:border-red-500/50",
              className
            )}
            style={{ background: "rgba(255,255,255,0.07)" }}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
