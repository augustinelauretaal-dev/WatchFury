'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tv, Eye, EyeOff, Loader2 } from 'lucide-react';

// Note: Metadata cannot be exported from 'use client' components in Next.js.
// To set metadata for this page, create a separate layout.tsx in app/signin/
// or move metadata to the closest server component parent.

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-pink-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 w-full shadow-2xl">

          {/* Logo row */}
          <div className="flex items-center gap-2">
            <Tv className="text-primary w-7 h-7" />
            <span className="gradient-text text-2xl font-black tracking-tight">WatchFury</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-bold text-white mt-4">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Sign in to save your watch history and watchlist.
          </p>

          {/* Social sign-in buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-colors border bg-white text-gray-900 hover:bg-gray-100 border-transparent"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-colors border bg-[#24292e] text-white hover:bg-[#2f363d] border-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-gray-600">or continue with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Email + password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Email address
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-[#222] border border-white/10 hover:border-white/20 focus:border-primary text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signin-password"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#222] border border-white/10 hover:border-white/20 focus:border-primary text-white placeholder-gray-600 px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Bottom divider */}
          <div className="border-t border-white/10 my-5" />

          {/* Sign-up link */}
          <p className="text-sm text-gray-500 text-center">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Disclaimer below card */}
        <p className="text-xs text-gray-600 text-center mt-4 max-w-sm mx-auto leading-relaxed">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:text-gray-400 underline underline-offset-2">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:text-gray-400 underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
