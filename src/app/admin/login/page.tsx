"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { adminFontVars } from "../fonts";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  /* Nothing here may reference the real credentials. This page previously
     pre-filled the account email and shipped an "auto-fill" button holding the
     password as a literal — both compiled straight into a public JS chunk. */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
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

      // Success: refresh so the new session cookie is picked up server-side,
      // then move to the dashboard.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("A connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={`${adminFontVars} ad-root ad-atmos relative flex min-h-screen w-full items-center justify-center overflow-hidden p-5`}
    >
      {/* A single wash from above rather than two coloured orbs, so the card
          stays the brightest thing on the page. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(120% 60% at 50% -15%, var(--ad-accent-soft), transparent 62%)",
        }}
      />

      <main className="relative z-10 w-full max-w-[400px]">
        <div className="ad-rise">
          {/* Masthead — stacked, not the accidental side-by-side the inline
              link and inline-flex badge produced before. */}
          <div className="mb-7 flex flex-col items-center text-center">
            <Link
              href="/"
              aria-label="B2B. home"
              className="ad-focusable inline-block transition hover:opacity-80"
            >
              <SmartImage
                src="/brand/wordmark.png"
                alt="B2B."
                width={792}
                height={398}
                autoAxis="width"
                priority
                className="h-11 w-auto"
              />
            </Link>
            <p className="ad-micro mt-5">Client portal</p>
            <h1 className="ad-display mt-2 text-[28px] text-[var(--ad-ink)]">Sign in</h1>
            <p className="mt-2 max-w-[19rem] text-[12.5px] leading-relaxed text-[var(--ad-ink-faint)]">
              Manage the portfolio&apos;s type, colour, sections and project archive.
            </p>
          </div>

          <div className="rounded-[16px] border border-[var(--ad-line)] bg-[var(--ad-panel)]/90 p-6 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-[10px] border border-[#f87171]/35 bg-[#f87171]/10 px-3.5 py-3 text-[12px] leading-relaxed text-[#fca5a5]"
              >
                <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-[11.5px] font-medium text-[var(--ad-ink-dim)]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--ad-ink-ghost)]" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoFocus
                    // Without these a password manager cannot fill the form,
                    // which was the real need behind the auto-fill button.
                    autoComplete="username"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    className="ad-field ad-field-lead"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-[11.5px] font-medium text-[var(--ad-ink-dim)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--ad-ink-ghost)]" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)}
                    placeholder="••••••••"
                    className="ad-field ad-field-lead-trail"
                    dir="ltr"
                  />
                  {/* On the right, where a reveal control is expected — it used
                      to sit on the left, colliding with the field icon. */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="ad-focusable absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-[var(--ad-ink-ghost)] transition hover:text-[var(--ad-ink)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {capsOn && (
                  <p className="ad-mono mt-1.5 text-[10px] text-[var(--ad-warn)]">
                    Caps Lock is on
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="ad-focusable mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--ad-accent)] px-4 py-3 text-[13px] font-semibold text-[var(--ad-accent-contrast)] shadow-[0_12px_34px_-14px_var(--ad-accent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="ad-focusable inline-flex items-center gap-1.5 rounded px-2 py-1 text-[12px] text-[var(--ad-ink-faint)] transition hover:text-[var(--ad-ink)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to the site
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
