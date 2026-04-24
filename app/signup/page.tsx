'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Tv, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

// ─── Password strength ────────────────────────────────────────────────────────

interface StrengthRule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: StrengthRule[] = [
  { label: 'At least 8 characters',       test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)',   test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)',   test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number (0–9)',             test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character (!@#…)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLOR = [
  '',
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-400',
  'bg-emerald-400',
  'bg-emerald-500',
];
const STRENGTH_TEXT = [
  '',
  'text-red-400',
  'text-orange-400',
  'text-yellow-400',
  'text-emerald-400',
  'text-emerald-400',
];

function usePasswordStrength(password: string) {
  return useMemo(() => {
    if (!password) return { score: 0, passed: [] };
    const passed = RULES.map((r) => r.test(password));
    const score = passed.filter(Boolean).length;
    return { score, passed };
  }, [password]);
}

// ─── Reusable input styles ────────────────────────────────────────────────────

const inputCls =
  'w-full bg-[#222] border border-white/10 hover:border-white/20 focus:border-primary text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors';

const labelCls = 'block text-xs font-medium text-gray-400 mb-1.5';

// ─── Social button ────────────────────────────────────────────────────────────

function SocialButton({
  onClick,
  children,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all border active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [done, setDone]               = useState(false);

  const { score, passed } = usePasswordStrength(password);

  const confirmMatch  = confirm.length > 0 && password === confirm;
  const confirmWrong  = confirm.length > 0 && password !== confirm;
  const formValid     =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    score >= 3 &&
    confirmMatch &&
    agreed;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValid) return;
    setIsLoading(true);
    // Mock async — replace with real auth
    setTimeout(() => {
      setIsLoading(false);
      setDone(true);
    }, 1600);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md animate-fade-in text-center">
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative bg-[#1a1a1a] border border-white/5 rounded-2xl p-10 shadow-2xl">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-black text-white mb-2">
              Account created!
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Welcome to WatchFury,{' '}
              <span className="text-white font-semibold">{name}</span>! Your
              account is ready. Sign in to start watching.
            </p>

            <Link
              href="/signin"
              className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              Go to Sign In
            </Link>

            <p className="mt-4 text-xs text-gray-600">
              Or{' '}
              <Link href="/" className="text-gray-500 hover:text-gray-300 underline underline-offset-2">
                continue browsing
              </Link>{' '}
              without signing in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Form screen ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-pink-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Tv className="text-primary w-7 h-7" />
            <span className="gradient-text text-2xl font-black tracking-tight">
              WatchFury
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-bold text-white mt-4">Create account</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Free forever. No credit card required.
          </p>

          {/* ── Social buttons ── */}
          <div className="space-y-3">
            <SocialButton className="bg-white text-gray-900 hover:bg-gray-100 border-transparent">
              {/* Google */}
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Sign up with Google
            </SocialButton>

            <SocialButton className="bg-[#24292e] text-white hover:bg-[#2f363d] border-white/10">
              {/* GitHub */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign up with GitHub
            </SocialButton>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-gray-600">or sign up with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Display name */}
            <div>
              <label htmlFor="signup-name" className={labelCls}>
                Display name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or nickname"
                required
                autoComplete="name"
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className={labelCls}>
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className={labelCls}>
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            n <= score
                              ? STRENGTH_COLOR[score]
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] font-semibold flex-shrink-0 transition-colors ${STRENGTH_TEXT[score]}`}
                    >
                      {STRENGTH_LABEL[score]}
                    </span>
                  </div>

                  {/* Rules checklist */}
                  <ul className="space-y-1">
                    {RULES.map((rule, i) => (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                          passed[i] ? 'text-emerald-400' : 'text-gray-600'
                        }`}
                      >
                        {passed[i] ? (
                          <Check className="w-3 h-3 flex-shrink-0" strokeWidth={2.5} />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-700 flex-shrink-0" />
                        )}
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="signup-confirm" className={labelCls}>
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className={`${inputCls} pr-11 ${
                    confirmWrong
                      ? 'border-red-500/60 focus:border-red-500'
                      : confirmMatch
                      ? 'border-emerald-500/60 focus:border-emerald-500'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                {/* Match indicator icon */}
                {confirmMatch && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {confirmWrong && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> Passwords do not match.
                </p>
              )}
              {confirmMatch && (
                <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match.
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group select-none mt-1">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                  aria-label="Agree to terms and privacy policy"
                />
                <div
                  className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    agreed
                      ? 'bg-primary border-primary'
                      : 'bg-[#222] border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {agreed && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to WatchFury&apos;s{' '}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formValid || isLoading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all mt-1 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <div className="border-t border-white/10 my-5" />
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link href="/signin" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-600 text-center mt-4 max-w-sm mx-auto leading-relaxed">
          WatchFury is a free platform for personal and educational use.
          No subscription or payment is ever required.
        </p>
      </div>
    </div>
  );
}
