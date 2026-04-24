'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Clock, FileText, AlertTriangle, CheckCircle2, Send, Loader2 } from 'lucide-react';

// Note: Metadata cannot be exported from 'use client' components in Next.js App Router.
// To set this page's metadata, add a metadata.ts file inside app/dmca/ with:
// export const metadata = {
//   title: 'DMCA Policy',
//   description: 'WatchFury DMCA takedown policy and copyright notice submission.',
// };

interface FormData {
  fullName: string;
  email: string;
  company: string;
  workDescription: string;
  infringingUrl: string;
  goodFaith: boolean;
  perjury: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  company: '',
  workDescription: '',
  infringingUrl: '',
  goodFaith: false,
  perjury: false,
};

function Checkbox({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          required
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
            checked
              ? 'bg-primary border-primary'
              : 'bg-[#222] border-white/20 group-hover:border-white/40'
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {children}
      </span>
    </label>
  );
}

export default function DmcaPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  }

  const inputClass =
    'w-full bg-[#222] border border-white/10 hover:border-white/20 focus:border-primary text-white placeholder-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="lg:grid lg:grid-cols-3 gap-8 items-start">
        {/* ── Left column ── */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">DMCA</span>
          </nav>

          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            <span className="gradient-text">DMCA</span> Copyright Takedown Policy
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-2xl">
            WatchFury respects intellectual property rights and complies with the Digital Millennium
            Copyright Act (DMCA). We do not host any video content — all streams are provided by
            third-party embed services. However, we take copyright concerns seriously and will act
            promptly on valid notices.
          </p>

          {/* Important Notice box */}
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="text-amber-400 shrink-0 mt-0.5"
              />
              <div>
                <h2 className="text-amber-400 font-bold text-sm mb-2">
                  Important Notice
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  WatchFury does not store or host any video files. All video content is sourced from
                  third-party providers. For the fastest resolution, we recommend submitting
                  takedown requests directly to the source providers:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside pl-1">
                  <li>VidSrc.to</li>
                  <li>VidSrc.me</li>
                  <li>2Embed.cc</li>
                  <li>EmbedSu</li>
                  <li>Other providers listed in our streaming servers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              To File a DMCA Notice
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              A valid DMCA takedown notice must include all of the following information:
            </p>
            <ol className="space-y-3">
              {[
                'Your full legal name, mailing address, telephone number, and email address.',
                'A description of the copyrighted work you claim has been infringed (title, rights holder, original broadcaster, etc.).',
                'The specific URL(s) on WatchFury where the allegedly infringing content appears.',
                'A statement that you have a good faith belief that the disputed use is not authorised by the copyright owner, its agent, or the law.',
                'A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorised to act on their behalf.',
                'Your electronic or physical signature.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-400 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Contact form */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <FileText size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Submit a DMCA Notice</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Fill in all required fields. We will review your request and respond within 3 business
              days.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
                  <CheckCircle2 size={30} className="text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Notice Received</h3>
                <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                  Your DMCA notice has been received. We will review and respond within{' '}
                  <span className="text-white font-semibold">3 business days</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData(initialFormData);
                  }}
                  className="mt-6 text-xs text-primary hover:underline transition-colors"
                >
                  Submit another notice
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Company / Rights Holder{' '}
                    <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Studio Dragon, JTBC, Netflix Korea"
                    className={inputClass}
                  />
                </div>

                {/* Work Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Copyrighted Work Description <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleChange}
                    placeholder="Describe the copyrighted work being infringed (e.g. drama title, season/episodes, original broadcast network, year of release)…"
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Infringing URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Infringing URL on WatchFury <span className="text-primary">*</span>
                  </label>
                  <input
                    type="url"
                    name="infringingUrl"
                    value={formData.infringingUrl}
                    onChange={handleChange}
                    placeholder="https://watchfury.com/drama/..."
                    required
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-600 mt-1.5 pl-1">
                    Paste the full WatchFury page URL where the infringing content appears.
                  </p>
                </div>

                {/* Legal checkboxes */}
                <div className="space-y-4 pt-1 border-t border-white/5 mt-2">
                  <p className="text-xs text-gray-500 pt-4">
                    Please read and confirm the following statements:
                  </p>
                  <Checkbox
                    name="goodFaith"
                    checked={formData.goodFaith}
                    onChange={handleChange}
                  >
                    I have a good faith belief that the use of the material described above is not
                    authorised by the copyright owner, its agent, or the law.
                  </Checkbox>
                  <Checkbox
                    name="perjury"
                    checked={formData.perjury}
                    onChange={handleChange}
                  >
                    I declare under penalty of perjury that the information in this notification is
                    accurate and that I am the copyright owner or am authorised to act on behalf of
                    the copyright owner.
                  </Checkbox>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.goodFaith || !formData.perjury}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send DMCA Notice
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Response Time */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-primary" />
                </div>
                <h3 className="text-white font-bold text-sm">Response Time</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                We process all valid DMCA notices within{' '}
                <span className="text-white font-semibold">3 business days</span> of receipt.
                Complex cases involving multiple episodes or seasons may require additional time,
                but we will keep you informed.
              </p>
            </div>

            {/* Counter-Notices */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-sm">Counter-Notices</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                If content you believe is lawfully available has been removed due to an erroneous
                notice, you may file a DMCA counter-notice. Counter-notices must include your
                contact details, identification of the removed content, and a statement under
                penalty of perjury.
              </p>
            </div>

            {/* Good Faith */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-green-400" />
                </div>
                <h3 className="text-white font-bold text-sm">Good Faith</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                We investigate every DMCA notice in good faith and will promptly remove or disable
                access to any content found to be infringing. Please note that knowingly filing a
                false notice may expose you to liability under 17 U.S.C. § 512(f).
              </p>
            </div>

            {/* Urgent Contact */}
            <div className="bg-[#1a1a1a] border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-sm">Direct Contact</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                For urgent matters, include{' '}
                <span className="text-amber-400 font-semibold">&quot;URGENT DMCA&quot;</span> in
                the description of your submission to ensure it is escalated and prioritised by our
                team immediately.
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed px-1">
              Repeat infringers will have their access to WatchFury terminated in appropriate
              circumstances, consistent with our{' '}
              <Link href="/terms" className="hover:text-gray-400 transition-colors underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
