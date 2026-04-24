import Link from 'next/link';
import { Tv } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] border-t border-white/5 mt-16 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-primary" />
            <span className="text-lg font-black gradient-text">WatchFury</span>
          </div>

          {/* Policy Links */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">·</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">·</span>
            <Link href="/dmca" className="hover:text-gray-300 transition-colors">
              DMCA
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            © {year}  Developed by Toothless
          </p>

        </div>
      </div>
    </footer>
  );
}
