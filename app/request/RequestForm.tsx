'use client';

import { useState } from 'react';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const REQUEST_TYPES = [
  'Request a Movie',
  'Report Broken Video',
  'Report a Bug',
  'Other',
] as const;

const DRAMA_TYPES = [
  'Movie',
  'Series',
  'K-Drama',
  'Other',
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  requestType: string;
  dramaName: string;
  dramaType: string;
  year: string;
  notes: string;
  email: string;
}

const INITIAL_FORM: FormData = {
  requestType: 'Request a Video',
  dramaName: '',
  dramaType: 'Movie',
  year: '',
  notes: '',
  email: '',
};

// ─── Shared style constants ───────────────────────────────────────────────────

const inputClass =
  'w-full bg-[#222] border border-white/10 hover:border-white/20 focus:border-primary text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors';

const labelClass = 'block text-sm font-medium text-gray-300 mb-2';

// ─── Component ────────────────────────────────────────────────────────────────

export default function RequestForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Patch a single field without touching the rest of formData. */
  const patch = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate async network request
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSubmitted(false);
  };

  // ── Success state ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-10 text-center animate-fade-in">
        {/* Green checkmark bubble */}
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Request Submitted!
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Thank you! We&apos;ve received your request for{' '}
          <span className="text-white font-semibold">
            {formData.dramaName.trim() || 'your item'}
          </span>
          . Our team will review it shortly.
        </p>

        <button
          onClick={handleReset}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors duration-200"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6"
    >
      {/* ── Request Type — pill toggle buttons ─────────────────────────── */}
      <div>
        <label className={labelClass}>Request Type</label>
        <div className="flex flex-wrap gap-2">
          {REQUEST_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => patch('requestType', type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                formData.requestType === type
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                  : 'bg-[#222] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Drama / Show Name ───────────────────────────────────────────── */}
      <div>
        <label htmlFor="dramaName" className={labelClass}>
          Movie / Show Name{' '}
          <span className="text-primary">*</span>
        </label>
        <input
          id="dramaName"
          type="text"
          required
          value={formData.dramaName}
          onChange={(e) => patch('dramaName', e.target.value)}
          placeholder="e.g. Horry Potter"
          className={inputClass}
        />
      </div>

      {/* ── Drama Type + Year — side by side on sm+ ─────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Drama Type */}
        <div>
          <label htmlFor="dramaType" className={labelClass}>
            Video Type
          </label>
          {/* Wrapper needed for the custom dropdown chevron */}
          <div className="relative">
            <select
              id="dramaType"
              value={formData.dramaType}
              onChange={(e) => patch('dramaType', e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={`${inputClass} appearance-none pr-10 cursor-pointer`}
            >
              {DRAMA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {/* Custom chevron icon */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className={labelClass}>
            Year{' '}
            <span className="text-gray-600 font-normal">(optional)</span>
          </label>
          <input
            id="year"
            type="text"
            value={formData.year}
            onChange={(e) => patch('year', e.target.value)}
            placeholder="e.g. 2026"
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Additional Notes ─────────────────────────────────────────────── */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Additional Notes{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => patch('notes', e.target.value)}
          placeholder="Any extra details, episode links, or context..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* ── Email ────────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Your Email{' '}
          <span className="text-gray-600 font-normal">
            (optional — for follow-up only)
          </span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => patch('email', e.target.value)}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>

      {/* ── Submit button ─────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold w-full flex items-center justify-center gap-2 transition-colors duration-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting&hellip;
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Request
          </>
        )}
      </button>
    </form>
  );
}
