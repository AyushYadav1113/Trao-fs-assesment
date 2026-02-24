"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Invalid credentials" });
        return;
      }

      router.push(redirectTo);
    } catch {
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
          >
            {errors.general}
          </motion.div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm text-white/70 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full h-12 px-4 rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-200"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm text-white/70 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Your password"
            autoComplete="current-password"
            className="w-full h-12 px-4 rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all duration-200"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-white/40 hover:text-white/80 transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 font-medium text-white hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-white/60 text-sm">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 py-8">
        <BackgroundBeams />

        {/* Softer glow */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-white font-semibold text-xl">
                TaroMausam
              </span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
              Welcome back
            </h1>

            <p className="text-white/70 text-sm">
              Sign in to access your weather dashboard
            </p>
          </div>

          <SigninForm />
        </motion.div>
      </div>
    </Suspense>
  );
}