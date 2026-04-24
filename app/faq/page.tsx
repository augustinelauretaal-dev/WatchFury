import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import FAQAccordion from './FAQAccordion';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Find answers to common questions about WatchFury — streaming, subtitles, video quality, content requests, and more.',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 animate-fade-in">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-white transition-colors duration-200">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-300">FAQ</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          {/* Pill label */}
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-5">
            Help Center
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Got questions? We&apos;ve got answers. Browse the most common
            questions about WatchFury — streaming, servers, content, and more.
          </p>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div className="border-t border-white/5 mb-10" />

        {/* ── FAQ Accordion (client component) ────────────────────────────── */}
        <FAQAccordion />

        {/* ── "Still have questions?" CTA card ────────────────────────────── */}
        <div className="mt-14 bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 sm:p-10 text-center">
          {/* Icon bubble */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-7 max-w-sm mx-auto leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Submit a drama
            request or let us know about an issue — we&apos;re happy to help.
          </p>

          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base"
          >
            Get in Touch
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
