"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import {
  Server,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Subtitles,
  Maximize2,
  Info,
  Bug,
  CheckCircle2,
  XCircle,
  Play,
  ExternalLink,
} from "lucide-react";
import {
  getTVSources,
  getMovieSources,
  markProviderError,
  getNextAvailableSource,
  allProvidersFailed,
  type StreamSource,
  type MediaType,
  logEmbedUrls,
} from "@/lib/embed";

// ─── Badge colour map ─────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pink: "bg-primary/20 text-primary border-primary/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  coral: "bg-[#ff2d55]/20 text-[#ff2d55] border-[#ff2d55]/30",
};

// ─── Provider Status Colors ───────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  error: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  loading: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
};

function QualityBadge({ label, color }: { label: string; color?: string }) {
  const cls = BADGE_CLASSES[color ?? "pink"] ?? BADGE_CLASSES.pink;
  return (
    <span
      className={clsx(
        "inline-flex items-center text-[9px] font-bold px-1.5 py-px rounded border tracking-wider leading-none",
        cls,
      )}
    >
      {label}
    </span>
  );
}

// ─── Spinner (reuses the orbital-dot style from globals.css) ──────────────────

function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="spinner-ring">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      {label && <p className="text-sm text-gray-400 animate-pulse">{label}</p>}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VideoPlayerProps {
  tmdbId: number;
  season?: number;
  episode?: number;
  title?: string;
  mediaType?: MediaType;
  /** Enable debug mode with console logging and UI */
  debug?: boolean;
  /** Callback when all providers fail */
  onAllProvidersFailed?: () => void;
  /** Callback when provider changes */
  onProviderChange?: (providerId: string, providerName: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoPlayer({
  tmdbId,
  season = 1,
  episode = 1,
  title,
  mediaType = "tv",
  debug = false,
  onAllProvidersFailed,
  onProviderChange,
}: VideoPlayerProps) {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [failedProviders, setFailedProviders] = useState<Set<string>>(new Set());
  const [lastError, setLastError] = useState<string | null>(null);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadStartTime = useRef<number>(0);

  // ── Debug logging ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (debug) {
      logEmbedUrls(tmdbId, mediaType, season, episode);
    }
  }, [tmdbId, season, episode, mediaType, debug]);

  // ── Rebuild sources whenever the target content changes ─────────────────────
  useEffect(() => {
    if (debug) {
      console.log(`[VideoPlayer] Building sources for ${mediaType} ${tmdbId}`,
        mediaType === "tv" ? `S${season}E${episode}` : "");
    }

    const list =
      mediaType === "movie"
        ? getMovieSources(tmdbId, { debug })
        : getTVSources(tmdbId, season, episode, { debug });

    setSources(list);
    setActiveIdx(0);
    setLoading(true);
    setErrored(false);
    setFailedProviders(new Set());
    setLastError(null);
    setAutoRetryCount(0);
    setIframeKey((k) => k + 1);

    if (list.length > 0) {
      setEmbedUrl(list[0].url);
    }
  }, [tmdbId, season, episode, mediaType, debug]);

  const currentSource: StreamSource | undefined = sources[activeIdx];

  // ── Update embed URL when source changes ────────────────────────────────────
  useEffect(() => {
    if (currentSource) {
      setEmbedUrl(currentSource.url);
      if (debug) {
        console.log(`[VideoPlayer] Active source: ${currentSource.name} (${currentSource.url})`);
      }
      onProviderChange?.(currentSource.id, currentSource.name);
    }
  }, [currentSource, debug, onProviderChange]);

  // ── Switch to a specific server ─────────────────────────────────────────────
  const switchServer = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= sources.length) return;
      
      const newSource = sources[idx];
      if (debug) {
        console.log(`[VideoPlayer] Switching to server ${idx + 1}: ${newSource.name}`);
        console.log(`[VideoPlayer] URL: ${newSource.url}`);
      }

      // Clear any existing timeout
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }

      setActiveIdx(idx);
      setLoading(true);
      setErrored(false);
      setLastError(null);
      setIframeKey((k) => k + 1);
      loadStartTime.current = performance.now();

      // Set a timeout for detecting slow/failed loads
      // Most embeds load within 5-10 seconds; 20s is generous
      const timeout = setTimeout(() => {
        if (debug) {
          console.warn(`[VideoPlayer] Load timeout for ${newSource.name}`);
        }
        // Don't auto-fail on timeout - just hide loading spinner
        // User can manually report if not working
        setLoading(false);
      }, 20000); // 20 second timeout

      setLoadTimeout(timeout);
    },
    [sources, loadTimeout, debug],
  );

  const prevServer = () => switchServer(activeIdx - 1);
  const nextServer = () => switchServer(activeIdx + 1);

  // ── Auto-fallback when provider fails ───────────────────────────────────────
  const handleProviderError = useCallback((providerId: string, errorMsg?: string) => {
    if (debug) {
      console.error(`[VideoPlayer] Provider error: ${providerId}`, errorMsg);
    }

    setFailedProviders((prev) => new Set(prev).add(providerId));
    setLastError(errorMsg || "Failed to load");
    
    // Mark source as error
    setSources((prev) => markProviderError(prev, providerId, errorMsg));

    // Find next available source
    const nextSource = getNextAvailableSource(
      providerId,
      tmdbId,
      mediaType,
      season,
      episode,
      Array.from(failedProviders).concat(providerId)
    );

    if (nextSource) {
      if (debug) {
        console.log(`[VideoPlayer] Auto-fallback to: ${nextSource.name}`);
      }
      
      // Auto-switch to next provider
      const nextIdx = sources.findIndex((s) => s.id === nextSource.id);
      if (nextIdx !== -1) {
        setAutoRetryCount((c) => c + 1);
        switchServer(nextIdx);
      }
    } else {
      // All providers failed
      setErrored(true);
      setLoading(false);
      onAllProvidersFailed?.();
      
      if (debug) {
        console.error("[VideoPlayer] All providers failed");
      }
    }
  }, [sources, tmdbId, mediaType, season, episode, failedProviders, debug, onAllProvidersFailed, switchServer]);

  // ── Handle iframe load events ───────────────────────────────────────────────
  // Note: onLoad fires when iframe document loads, but cross-origin restrictions
  // prevent us from knowing if the video actually loaded successfully
  const handleIframeLoad = useCallback(() => {
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }

    const loadTime = Math.round(performance.now() - loadStartTime.current);
    
    if (debug) {
      console.log(`[VideoPlayer] Iframe loaded in ${loadTime}ms`);
    }

    // Hide loading spinner after iframe loads
    // (We can't detect if video plays due to cross-origin restrictions)
    setLoading(false);
    
    // Reset retry count on successful load
    setAutoRetryCount(0);
    
    // Auto-hide any error after 3 seconds if iframe at least loaded
    setTimeout(() => {
      setErrored(false);
    }, 100);
  }, [loadTimeout, debug]);

  const handleIframeError = useCallback(() => {
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }

    if (currentSource) {
      handleProviderError(currentSource.id, "Iframe failed to load");
    }
  }, [currentSource, loadTimeout, handleProviderError]);

  // ── Manual retry with same provider ─────────────────────────────────────────
  const retryCurrent = useCallback(() => {
    if (!currentSource) return;
    
    if (debug) {
      console.log(`[VideoPlayer] Retrying ${currentSource.name}`);
    }
    
    setLoading(true);
    setErrored(false);
    setIframeKey((k) => k + 1);
    loadStartTime.current = performance.now();
  }, [currentSource, debug]);

  // ── Refresh current server ──────────────────────────────────────────────────
  const refresh = useCallback(() => {
    if (debug) {
      console.log("[VideoPlayer] Refreshing current server");
    }
    retryCurrent();
  }, [debug, retryCurrent]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };
  }, [loadTimeout]);

  // ── Native fullscreen on the wrapper div ─────────────────────────────────────
  const requestFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  // ── Copy debug URL to clipboard ──────────────────────────────────────────────
  const copyDebugUrl = useCallback(() => {
    if (currentSource) {
      navigator.clipboard.writeText(currentSource.url);
      if (debug) {
        console.log("[VideoPlayer] Copied URL to clipboard:", currentSource.url);
      }
    }
  }, [currentSource, debug]);

  // ── Open URL in new tab for manual testing ───────────────────────────────────
  const openInNewTab = useCallback(() => {
    if (currentSource) {
      window.open(currentSource.url, "_blank", "noopener,noreferrer");
    }
  }, [currentSource]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") prevServer();
      if (e.key === "ArrowRight") nextServer();
      if (e.key === "r" || e.key === "R") refresh();
      if (e.key === "d" || e.key === "D") setShowDebug((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevServer, nextServer, refresh]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3 w-full">
      {/* ── Server selector card ─────────────────────────────────────────── */}
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-white">
              Streaming Servers
            </span>
            {currentSource && (
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                — using{" "}
                <span className="text-gray-200 font-medium">
                  {currentSource.name}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Info toggle */}
            <button
              onClick={() => setShowInfo((v) => !v)}
              className={clsx(
                "p-1.5 rounded-md transition-colors",
                showInfo
                  ? "bg-primary/20 text-primary"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5",
              )}
              title="Show server info"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Refresh */}
            <button
              onClick={refresh}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
              title="Reload current server  (R)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={requestFullscreen}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="bg-[#111] border border-white/5 rounded-lg p-3 text-xs text-gray-400 space-y-1 animate-slide-down">
            <p>
              <span className="text-gray-200 font-medium">How it works:</span>{" "}
              Each button below is an independent streaming server. If one
              doesn&apos;t load or shows a black screen, click the next server.
            </p>
            <p>
              <span className="text-blue-400 font-medium">HD</span> — typically
              1080p · <span className="text-emerald-400 font-medium">SUB</span>{" "}
              — subtitles built-in ·{" "}
              <span className="text-purple-400 font-medium">4K</span> — up to
              2160p when available
            </p>
            <p className="text-gray-600">
              Keyboard: ← / → switch server · R refresh
            </p>
          </div>
        )}

        {/* Server tabs */}
        <div className="flex flex-wrap gap-2">
          {sources.map((src, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={src.id}
                onClick={() => switchServer(idx)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border",
                  isActive
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-[1.03]"
                    : "bg-[#242424] border-white/5 text-gray-400 hover:bg-[#2e2e2e] hover:text-white hover:border-white/10",
                )}
              >
                {/* Server number */}
                <span
                  className={clsx(
                    "w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0",
                    isActive ? "bg-white/25" : "bg-white/10",
                  )}
                >
                  {idx + 1}
                </span>

                {/* Name */}
                <span className="leading-none">{src.name}</span>

                {/* Quality / feature badges */}
                {src.badge && (
                  <QualityBadge
                    label={src.badge}
                    color={isActive ? "pink" : src.badgeColor}
                  />
                )}

                {/* Subtitle indicator */}
                {src.hasSubs && (
                  <Subtitles
                    className={clsx(
                      "w-3 h-3 flex-shrink-0",
                      isActive ? "text-white/60" : "text-gray-600",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Prev / Next nav + counter */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <button
            onClick={prevServer}
            disabled={activeIdx === 0}
            className={clsx(
              "flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors",
              activeIdx === 0
                ? "border-white/5 text-gray-700 cursor-not-allowed"
                : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5",
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <span className="text-xs text-gray-600 tabular-nums">
            Server{" "}
            <span className="text-gray-400 font-medium">{activeIdx + 1}</span> /{" "}
            <span className="text-gray-500">{sources.length}</span>
          </span>

          <button
            onClick={nextServer}
            disabled={activeIdx >= sources.length - 1}
            className={clsx(
              "flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-colors",
              activeIdx >= sources.length - 1
                ? "border-white/5 text-gray-700 cursor-not-allowed"
                : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5",
            )}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Player ─────────────────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative w-full bg-black rounded-xl overflow-hidden border border-white/5"
        style={{ paddingBottom: "56.25%" /* 16:9 */ }}
      >
        {/* Loading overlay */}
        {loading && !errored && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
            <Spinner
              label={
                currentSource
                  ? `Loading from ${currentSource.name}…`
                  : "Loading…"
              }
            />
          </div>
        )}

        {/* Manual "Not Working" button (always visible when playing) */}
        {!loading && !errored && currentSource && (
          <div className="absolute top-2 right-2 z-10 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleProviderError(currentSource.id, "User reported: video not loading")}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white text-[10px] font-medium"
              title="Report this server as not working"
            >
              <AlertTriangle className="w-3 h-3" />
              Not Working?
            </button>
          </div>
        )}

        {/* Error overlay */}
        {errored && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 gap-4 px-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <div>
              <p className="text-white font-semibold mb-1 text-lg">Video unavailable</p>
              <p className="text-gray-400 text-sm max-w-md">
                {currentSource?.name} couldn&apos;t load this video. 
                This usually means the content isn&apos;t available from this provider.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <button
                onClick={refresh}
                className="flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Same Server
              </button>
              {activeIdx < sources.length - 1 && (
                <button
                  onClick={nextServer}
                  className="flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
                >
                  Try Next Server
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleProviderError(currentSource?.id || '', "User reported: video not playing")}
              className="text-xs text-gray-500 hover:text-gray-400 underline mt-2"
            >
              Report this server as not working
            </button>
          </div>
        )}

        {/* Iframe — key prop forces a full remount on every switch */}
        {currentSource && (
          <iframe
            key={`${iframeKey}__${currentSource.id}__${tmdbId}__s${season}e${episode}`}
            ref={iframeRef}
            src={currentSource.url}
            title={
              title
                ? `${title} — S${season} E${episode} — ${currentSource.name}`
                : `WatchFury Player — ${currentSource.name}`
            }
            className="absolute inset-0 w-full h-full border-0 bg-black"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; gyroscope; accelerometer; clipboard-write; web-share"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            loading="eager"
          />
        )}
      </div>

      {/* ── Debug Panel ─────────────────────────────────────────────────────── */}
      {showDebug && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-400">
              <Bug className="w-4 h-4" />
              Debug Mode
            </span>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-white"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-gray-500">
            <div className="flex justify-between">
              <span>TMDB ID:</span>
              <span className="text-gray-300">{tmdbId}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="text-gray-300">{mediaType}</span>
            </div>
            {mediaType === "tv" && (
              <>
                <div className="flex justify-between">
                  <span>Season:</span>
                  <span className="text-gray-300">{season}</span>
                </div>
                <div className="flex justify-between">
                  <span>Episode:</span>
                  <span className="text-gray-300">{episode}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>Active Provider:</span>
              <span className="text-gray-300">{currentSource?.name || "None"}</span>
            </div>
            <div className="flex justify-between">
              <span>Failed Providers:</span>
              <span className="text-red-400">{failedProviders.size} / {sources.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto Retries:</span>
              <span className="text-yellow-400">{autoRetryCount}</span>
            </div>
          </div>

          {/* Embed URL */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-gray-500 mb-1">Embed URL:</div>
            <div className="bg-black rounded p-2 text-[10px] text-gray-400 break-all">
              {embedUrl}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={copyDebugUrl}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Copy URL
              </button>
              <button
                onClick={openInNewTab}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
              >
                <Play className="w-3 h-3" />
                Test URL
              </button>
            </div>
          </div>

          {/* Provider Status */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-gray-500 mb-2">Provider Status:</div>
            <div className="space-y-1">
              {sources.map((src) => {
                const isFailed = failedProviders.has(src.id);
                const isActive = src.id === currentSource?.id;
                return (
                  <div
                    key={src.id}
                    className={clsx(
                      "flex items-center gap-2 px-2 py-1 rounded",
                      isActive && "bg-white/5"
                    )}
                  >
                    {isFailed ? (
                      <XCircle className="w-3 h-3 text-red-500" />
                    ) : isActive ? (
                      <Play className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-gray-600" />
                    )}
                    <span className={clsx(
                      isFailed && "text-red-400 line-through",
                      isActive && "text-emerald-400"
                    )}>
                      {src.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Debug Toggle (when debug mode enabled) ──────────────────────────── */}
      {debug && !showDebug && (
        <button
          onClick={() => setShowDebug(true)}
          className="flex items-center gap-1.5 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          <Bug className="w-3 h-3" />
          Show Debug (D)
        </button>
      )}

      {/* ── Footer strip ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        {/* Disclaimer */}
        <p className="text-[11px] text-gray-700 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-gray-700 flex-shrink-0" />
          Personal &amp; educational use only
        </p>

        <div className="flex items-center gap-3">
          {/* Auto-retry indicator */}
          {autoRetryCount > 0 && (
            <p className="text-[11px] text-yellow-600 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Auto-retried {autoRetryCount} time{autoRetryCount !== 1 ? "s" : ""}
            </p>
          )}

          {/* Subtitle note */}
          {currentSource?.hasSubs && (
            <p className="text-[11px] text-gray-700 flex items-center gap-1">
              <Subtitles className="w-3 h-3 text-gray-700 flex-shrink-0" />
              Subtitles available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
