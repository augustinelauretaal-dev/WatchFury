"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Tv,
  Home,
  MessageCircle,
  Film,
  Compass,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";
import SearchModal from "./SearchModal";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faq", label: "FAQ", icon: MessageCircle },
  { href: "/request", label: "Request", icon: Film },
  { href: "/explore", label: "Explore", icon: Compass },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // ESC closes mobile menu
      if (e.key === "Escape") setMobileOpen(false);
      // Ctrl+K or Cmd+K opens search modal
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#111111]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Tv className="w-5 h-5 text-primary" />
            <span className="text-lg font-black gradient-text">WatchFury</span>
          </Link>

          {/* Center — Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-300 hover:text-white rounded hover:bg-white/5 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-2.5 h-9 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
              aria-label="Open search (Ctrl+K)"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              {/* Keyboard shortcut hint — visible on md+ */}
              <span className="hidden md:flex items-center gap-1">
                <span className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                  Search
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-600 leading-none group-hover:border-white/20 transition-colors">
                  Ctrl K
                </kbd>
              </span>
            </button>

            {/* Sign In */}
            <Link
              href="/signin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center w-9 h-9 text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors ml-1"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[#111111] border-t border-white/5 animate-slide-down">
            <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-col gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}

              {/* Sign In in mobile menu */}
              <Link
                href="/signin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
              >
                <User className="w-4 h-4 flex-shrink-0" />
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={closeSearch} />}
    </>
  );
}
