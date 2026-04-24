import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import RequestForm from './RequestForm';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Request Video',
  description:
    'Request a video, report a broken video, or report a bug on WatchFury. We review all requests and aim to add content within 48 hours.',
};

// ─── Static sidebar data ──────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  'Fill out the form',
  'We review your request',
  'Video added within 48h',
];

const WHAT_WE_ACCEPT = [
  'Movie',
  'Hollywood TV Shows',
  'Korean Dramas',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RequestPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 animate-fade-in">

        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-10"
        >
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-300">Request Movie</span>
        </nav>

        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
            Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
            Request a <span className="gradient-text">Movie</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Submit a request and
            we&apos;ll do our best to add it to our library.
          </p>
        </div>

        {/* ── Main grid: form (left) + sidebar (right) ──────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left col — interactive form (client component) */}
          <div className="lg:col-span-2">
            <RequestForm />
          </div>

          {/* Right col — static info sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20">

            {/* ── How it works ──────────────────────────────────────────────── */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span aria-hidden="true">📋</span>
                How it works
              </h3>
              <ol className="space-y-3">
                {HOW_IT_WORKS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 border border-primary/25 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-400 leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── What we accept ────────────────────────────────────────────── */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span aria-hidden="true">📺</span>
                What we accept
              </h3>
              <ul className="space-y-2.5">
                {WHAT_WE_ACCEPT.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Quick tip ─────────────────────────────────────────────────── */}
            <div className="bg-[#1a1a1a] border border-primary/10 rounded-xl p-5 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span aria-hidden="true">⚡</span>
                Quick tip
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                If a video isn&apos;t playing, try switching servers in the video
                player —— we have{' '}
                <span className="text-white font-semibold">3 servers</span>{' '}
                available!
              </p>
            </div>

          </aside>
        </div>

      </div>
    </div>
  );
}
