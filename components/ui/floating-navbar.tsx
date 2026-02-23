"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface FloatingNavbarProps {
  navItems: NavItem[];
  className?: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

export function FloatingNavbar({
  navItems,
  className,
  showLogout = false,
  onLogout,
}: FloatingNavbarProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]",
            "flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full",
            "bg-black/40 backdrop-blur-xl border border-white/10",
            "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
            className
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 mr-2 sm:mr-4 pr-2 sm:pr-4 border-r border-white/10">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs font-bold">W</span>
            </div>
            <span className="text-white font-semibold text-xs sm:text-sm hidden sm:block">
              WeatherVision
            </span>
          </Link>

          {/* Nav Items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {item.icon && <span className="text-xs">{item.icon}</span>}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          {showLogout && onLogout && (
            <button
              onClick={onLogout}
              className="ml-1 sm:ml-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              Logout
            </button>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
