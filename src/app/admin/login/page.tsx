"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("bbagency36@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Success: redirect cleanly to dashboard
      window.location.href = "/admin";
    } catch {
      setError("A connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail("bbagency36@gmail.com");
    setPassword("Mm12Go@#$");
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-white flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Dynamic Background Studio Glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-red-600/15 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-700/10 blur-[180px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img src="/brand/wordmark.png" alt="B2B." className="h-14 w-auto mx-auto drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3.5 py-1 text-xs text-red-400 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
            <span>Exclusive Client Portal</span>
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-white font-brand">
            Client Login
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Full control over fonts, images, icons, sections, header and footer
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl border border-zinc-800/90 bg-[#0c0c12]/90 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(229,9,20,0.15)] backdrop-blur-xl">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/50 bg-red-950/40 p-3.5 text-xs text-red-300 leading-relaxed animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Client Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bbagency36@gmail.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                  dir="ltr"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillCredentials}
                  className="text-[11px] text-red-400 hover:text-red-300 transition flex items-center gap-1 font-medium"
                >
                  <KeyRound className="h-3 w-3" />
                  Auto-fill credentials
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 px-4 text-sm font-bold text-white shadow-[0_0_25px_rgba(229,9,20,0.5)] transition hover:from-red-500 hover:to-red-600 hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Client Account Info Callout */}
          <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-red-500" />
              <span>Authorized Client Account</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-mono tracking-wide" dir="ltr">
              bbagency36@gmail.com
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5">
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            <span>Back to main site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
