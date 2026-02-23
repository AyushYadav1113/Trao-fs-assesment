"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  loading?: boolean;
  className?: string;
}

export function SearchInput({
  placeholder = "Search for a city...",
  onSearch,
  loading = false,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)"
            : "0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center rounded-2xl bg-white/5 backdrop-blur-xl overflow-hidden"
      >
        {/* Search Icon */}
        <div className="pl-3 sm:pl-4 pr-2 text-white/40">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3 sm:py-4 px-2 text-white placeholder-white/30 outline-none text-sm sm:text-base"
        />

        {/* Animated indicator */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setValue("")}
              className="mr-2 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={cn(
            "m-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200",
            "bg-gradient-to-r from-purple-600 to-blue-600",
            "hover:from-purple-500 hover:to-blue-500",
            "text-white disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2 whitespace-nowrap"
          )}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Search"
          )}
        </button>
      </motion.div>
    </form>
  );
}
