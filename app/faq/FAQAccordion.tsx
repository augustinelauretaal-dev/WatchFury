'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_DATA: FAQItem[] = [
  // ── Getting Started ──────────────────────────────────────────────────────
  {
    category: 'Getting Started',
    question: 'Is WatchFury free to use?',
    answer:
      'Yes! WatchFury is completely free. No subscription, no credit card required. Simply visit the site and start watching your favorite movies, TV shows, and dramas instantly.',
  },
  {
    category: 'Getting Started',
    question: 'Do I need to create an account?',
    answer:
      'No account is required to browse and watch content. However, creating an account (coming soon) will let you save your watch history, create watchlists, and pick up where you left off.',
  },
  {
    category: 'Getting Started',
    question: 'What devices can I watch on?',
    answer:
      'WatchFury works on any device with a modern web browser—desktop, laptop, tablet, or smartphone. No app download needed.',
  },

  // ── Watching ─────────────────────────────────────────────────────────────
  {
    category: 'Watching',
    question: 'Why is the video not playing or showing a black screen?',
    answer:
      'This usually happens when the current streaming server is overloaded or temporarily down. Click a different server button (e.g., Server 2, Server 3) directly above the player—we have 10 servers available. One of them will work!',
  },
  {
    category: 'Watching',
    question: 'Can I change video quality?',
    answer:
      'Quality options depend on the streaming server. Most of our servers (marked HD or 4K) offer 1080p or higher. Quality controls appear inside the video player once it loads.',
  },
  {
    category: 'Watching',
    question: 'Are subtitles available?',
    answer:
      'Yes! Many of our servers include built-in English subtitles. Look for servers marked with the subtitle icon (CC) in the server selector. Subtitle language options vary by server.',
  },
  {
    category: 'Watching',
    question: 'Can I download episodes to watch offline?',
    answer:
      'Downloading is not supported on WatchFury. This is a browser-based streaming platform.',
  },

  // ── Content ──────────────────────────────────────────────────────────────
  {
    category: 'Content',
    question: "Why isn't my favorite movie or show available?",
    answer:
      "Our library depends on third-party streaming providers. If a title isn't showing up, you can submit a request on our Request Page and we'll do our best to add it.",
  },
  {
    category: 'Content',
    question: 'How often is new content added?',
    answer:
      'New movies and TV episodes are added regularly as they are released. Ongoing series are typically updated within 24–48 hours of their official air date.',
  },
  {
    category: 'Content',
    question: 'Do you have Hollywood shows, Anime, and Asian dramas?',
    answer:
      'Yes! Use the Explore page and filter by category (Hollywood, Anime, K-Drama, C-Drama) to browse our full selection.',
  },

  // ── Technical ────────────────────────────────────────────────────────────
  {
    category: 'Technical',
    question: 'The site is slow or not loading. What should I do?',
    answer:
      'Try refreshing the page, clearing your browser cache, or disabling any VPN or ad-blocker extensions that may interfere with streaming embeds.',
  },
  {
    category: 'Technical',
    question: 'I found a bug or broken link. How do I report it?',
    answer:
      "You can use our Request Page to send us a message. Select 'Report a Bug' as the type, and we'll look into it immediately.",
  },
];

// Pre-compute which items open a new category section so we never mutate
// state during render.
const FAQ_ITEMS = FAQ_DATA.map((item, i) => ({
  ...item,
  isFirstInCategory: i === 0 || item.category !== FAQ_DATA[i - 1].category,
}));

// ─── Component ────────────────────────────────────────────────────────────────

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div key={idx}>
            {/* Category divider label */}
            {item.isFirstInCategory && (
              <p
                className={`text-xs font-bold uppercase tracking-widest text-primary mb-3 ${
                  idx === 0 ? 'mt-0' : 'mt-6'
                }`}
              >
                {item.category}
              </p>
            )}

            {/* Accordion card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
              >
                <span className="font-semibold text-white text-sm sm:text-base group-hover:text-primary/90 transition-colors duration-200 pr-3">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'rotate-180 text-primary'
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
              </button>

              {/*
               * Answer panel — uses CSS grid-rows trick for smooth, proportional
               * height animation without JavaScript measurement.
               *   Closed: grid-rows-[0fr]  → inner div collapses to 0 height
               *   Open:   grid-rows-[1fr]  → inner div expands to natural height
               * The `min-h-0` on the inner wrapper is required for the collapse.
               */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0">
                  <p className="px-5 pb-5 pt-1 text-gray-400 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
