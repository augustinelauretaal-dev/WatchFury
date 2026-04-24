'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Tv, Mail, ArrowLeft, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

type Step = 'email' | 'sent';

const RESEND_COOLDOWN = 60; // seconds

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    // Mock async send
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
      startCooldown();
    }, 1500);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      startCooldown();
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-pink-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">

        {/* ── STEP 1: Enter Email ─────────────────────────────────────────── */}
        {step === 'email' && (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 shadow-2xl">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Tv className="text-primary w-6 h-6" />
              <span className="gradient-text text-xl font-black tracking-tight">WatchFury</span>
            </Link>

            {/* Icon */}
            <div className="mt-6 mb-4 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>

            {/* Heading */}
            <h1 className="text-xl font-bold text-white">Forgot your password?</h1>
            <p className="text-sm text-gray-500 mt-1.5 mb-6 leading-relaxed">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-medium text-gray-400 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  className={`w-full bg-[#222] border text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors ${
                    error
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-white/10 hover:border-white/20 focus:border-primary'
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending reset link…
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to sign in */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP 2: Email Sent Confirmation ─────────────────────────────── */}
        {step === 'sent' && (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 shadow-2xl text-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit mx-auto justify-center">
              <Tv className="text-primary w-6 h-6" />
              <span className="gradient-text text-xl font-black tracking-tight">WatchFury</span>
            </Link>

            {/* Success icon */}
            <div className="mt-6 mb-4 mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            {/* Heading */}
            <h1 className="text-xl font-bold text-white">Check your inbox</h1>
            <p className="text-sm text-gray-400 mt-2 mb-1 leading-relaxed">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-white break-all mb-6">
              {email}
            </p>

            {/* Instructions */}
            <div className="bg-[#222] border border-white/5 rounded-xl p-4 text-left space-y-2.5 mb-6">
              {[
                "Open the email from WatchFury.",
                "Click the 'Reset Password' button.",
                "Choose a new password and sign in.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 border border-primary/25 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-400 leading-snug">{step}</p>
                </div>
              ))}
            </div>

            {/* Didn't receive / Resend */}
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or resend below.
              </p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-white/10 transition-all disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:bg-white/5 hover:enabled:border-white/20 text-gray-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Resending…
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <RefreshCw size={14} className="opacity-50" />
                    Resend in {cooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Resend email
                  </>
                )}
              </button>
            </div>

            {/* Cooldown progress bar */}
            {cooldown > 0 && (
              <div className="mt-3 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/40 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(cooldown / RESEND_COOLDOWN) * 100}%` }}
                />
              </div>
            )}

            {/* Wrong email */}
            <p className="text-xs text-gray-600 mt-4">
              Wrong email?{' '}
              <button
                onClick={() => {
                  setStep('email');
                  setCooldown(0);
                  if (timerRef.current) clearInterval(timerRef.current);
                }}
                className="text-primary hover:underline font-medium"
              >
                Try a different address
              </button>
            </p>

            {/* Divider + back */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-600 text-center mt-4 leading-relaxed">
          Remember your password?{' '}
          <Link href="/signin" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
          {' '}·{' '}
          <Link href="/signup" className="hover:text-gray-400 underline underline-offset-2">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
