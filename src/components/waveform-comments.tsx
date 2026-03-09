"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Send, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { StopComment } from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BAR_COUNT = 70;
const VOICE_TRIGGER_MS = 500; // playhead proximity to reveal a voice
const VOICE_LINGER_MS = 3500; // how long the whisper stays visible
const CLUSTER_THRESHOLD_MS = 2000;
const MARKER_SIZE = 18;
const STACK_OFFSET = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministic pseudo-waveform seeded by stopId — shaped like terrain */
function generateBars(stopId: string): number[] {
  let hash = 0;
  for (let i = 0; i < stopId.length; i++) {
    hash = (hash << 5) - hash + stopId.charCodeAt(i);
    hash |= 0;
  }

  const bars: number[] = [];
  let prev = 0.5;
  for (let i = 0; i < BAR_COUNT; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const jitter = ((hash % 100) / 100 - 0.5) * 0.4;
    // Smooth walk: each bar drifts gently from the last
    prev = Math.max(0.12, Math.min(1, prev + jitter));
    bars.push(prev);
  }
  return bars;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

function initial(name: string | undefined): string {
  return name ? name.charAt(0).toUpperCase() : "?";
}

/** Pick a warm accent color for a walker marker based on their user id */
function walkerColor(userId: string): string {
  const colors = [
    "bg-bembe-coral",
    "bg-bembe-gold",
    "bg-bembe-teal",
    "bg-amber-500",
    "bg-rose-400",
    "bg-emerald-500",
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Group nearby voices so they stack instead of overlapping */
function clusterVoices(
  comments: StopComment[]
): { anchor_ms: number; voices: StopComment[] }[] {
  if (comments.length === 0) return [];

  const sorted = [...comments].sort(
    (a, b) => a.timestamp_ms - b.timestamp_ms
  );

  const clusters: { anchor_ms: number; voices: StopComment[] }[] = [];
  let cur = { anchor_ms: sorted[0].timestamp_ms, voices: [sorted[0]] };

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].timestamp_ms - cur.anchor_ms <= CLUSTER_THRESHOLD_MS) {
      cur.voices.push(sorted[i]);
    } else {
      clusters.push(cur);
      cur = { anchor_ms: sorted[i].timestamp_ms, voices: [sorted[i]] };
    }
  }
  clusters.push(cur);
  return clusters;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WaveformCommentsProps {
  stopId: string;
  durationSeconds: number;
  elapsed: number;
  onSeek: (seconds: number) => void;
}

export default function WaveformComments({
  stopId,
  durationSeconds,
  elapsed,
  onSeek,
}: WaveformCommentsProps) {
  const { t } = useI18n();
  const waveformRef = useRef<HTMLDivElement>(null);

  const [comments, setComments] = useState<StopComment[]>([]);
  // id → wall-clock time it was revealed
  const [revealed, setRevealed] = useState<Map<string, number>>(new Map());
  const [inputText, setInputText] = useState("");
  const [inputAnchorMs, setInputAnchorMs] = useState<number | null>(null);
  const [posting, setPosting] = useState(false);

  const durationMs = durationSeconds * 1000;
  const elapsedMs = elapsed * 1000;
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0;
  const bars = useMemo(() => generateBars(stopId), [stopId]);
  const clusters = useMemo(() => clusterVoices(comments), [comments]);

  // ---- Fetch voices left by fellow walkers ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/stops/${stopId}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setComments(data.comments ?? []);
        }
      } catch {
        /* non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stopId]);

  // ---- Reveal voices as the playhead walks past them ----
  useEffect(() => {
    if (durationMs === 0) return;

    const now = Date.now();
    let dirty = false;
    const next = new Map(revealed);

    for (const c of comments) {
      if (
        Math.abs(elapsedMs - c.timestamp_ms) <= VOICE_TRIGGER_MS &&
        !next.has(c.id)
      ) {
        next.set(c.id, now);
        dirty = true;
      }
    }

    // Fade out after linger period
    for (const [id, ts] of next) {
      if (now - ts > VOICE_LINGER_MS) {
        next.delete(id);
        dirty = true;
      }
    }

    if (dirty) setRevealed(next);
  }, [elapsedMs, comments, durationMs]);

  // ---- Seek by clicking on the waveform bars ----
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!waveformRef.current || durationSeconds === 0) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      onSeek(Math.round(ratio * durationSeconds));
    },
    [durationSeconds, onSeek]
  );

  // ---- Click above the waveform to leave a voice ----
  const handleVoiceZoneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!waveformRef.current || durationMs === 0) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      setInputAnchorMs(Math.round(ratio * durationMs));
      setInputText("");
    },
    [durationMs]
  );

  // ---- Post a voice ----
  const handlePost = useCallback(async () => {
    if (!inputText.trim() || inputAnchorMs === null || posting) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/stops/${stopId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp_ms: inputAnchorMs,
          body: inputText.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setInputAnchorMs(null);
        setInputText("");
      }
    } catch {
      /* fail silently */
    } finally {
      setPosting(false);
    }
  }, [inputText, inputAnchorMs, stopId, posting]);

  return (
    <div className="relative select-none">
      {/* Voice markers — traces left by fellow walkers */}
      <div
        className="relative h-16 cursor-pointer"
        onClick={handleVoiceZoneClick}
        title={t.comments.add}
      >
        {/* Drop-pin for pending comment */}
        {inputAnchorMs !== null && durationMs > 0 && (
          <div
            className="absolute bottom-0 z-20 pointer-events-none"
            style={{
              left: `${(inputAnchorMs / durationMs) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="w-0.5 h-5 bg-bembe-coral/70 mx-auto" />
            <div className="w-2.5 h-2.5 rounded-full bg-bembe-coral mx-auto -mt-0.5 shadow-sm shadow-bembe-coral/40" />
          </div>
        )}

        {/* Clustered walker markers */}
        {clusters.map((cluster) => {
          const pct =
            durationMs > 0
              ? (cluster.anchor_ms / durationMs) * 100
              : 0;

          return (
            <div
              key={cluster.anchor_ms}
              className="absolute bottom-0"
              style={{
                left: `${pct}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Stacked walker initials (max 3 visible) */}
              {cluster.voices.slice(0, 3).map((voice, idx) => {
                const isWhispering = revealed.has(voice.id);
                const color = walkerColor(voice.user_id);
                return (
                  <div key={voice.id}>
                    <div
                      className={`absolute flex items-center justify-center rounded-full text-white text-[8px] font-bold border-[1.5px] border-bembe-sand shadow-sm transition-all duration-300 ${color} ${
                        isWhispering ? "scale-110 ring-2 ring-white/50" : ""
                      }`}
                      style={{
                        width: MARKER_SIZE,
                        height: MARKER_SIZE,
                        bottom: 2 + idx * STACK_OFFSET,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      title={`${voice.user?.full_name}: "${voice.body}"`}
                    >
                      {initial(voice.user?.full_name)}
                    </div>

                    {/* Whisper bubble — appears when the playhead passes */}
                    {isWhispering && idx === 0 && (
                      <div
                        className="absolute z-30 pointer-events-none"
                        style={{
                          bottom:
                            6 +
                            Math.min(cluster.voices.length, 3) * STACK_OFFSET,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg shadow-bembe-night/5 px-3 py-2 min-w-[100px] max-w-[180px] border border-bembe-night/5">
                          <p className="text-[10px] font-semibold text-bembe-teal truncate">
                            {voice.user?.full_name}
                          </p>
                          <p className="text-[11px] text-bembe-night/80 leading-snug line-clamp-2 mt-0.5">
                            {voice.body}
                          </p>
                          <p className="text-[9px] text-bembe-night/25 mt-1">
                            {t.comments.at} {formatTime(voice.timestamp_ms)}
                          </p>
                        </div>
                        {/* Nub pointing down to the marker */}
                        <div className="w-2 h-2 bg-white/95 border-r border-b border-bembe-night/5 rotate-45 mx-auto -mt-1.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* +N overflow badge */}
              {cluster.voices.length > 3 && (
                <div
                  className="absolute flex items-center justify-center rounded-full bg-bembe-night/40 text-white text-[7px] font-bold backdrop-blur-sm"
                  style={{
                    width: MARKER_SIZE - 2,
                    height: MARKER_SIZE - 2,
                    bottom: 2 + 3 * STACK_OFFSET,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  +{cluster.voices.length - 3}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Waveform — terrain-like bars that the playhead walks across */}
      <div
        ref={waveformRef}
        className="relative h-11 flex items-end gap-[1.5px] cursor-pointer rounded-lg overflow-hidden"
        onClick={handleSeek}
      >
        {bars.map((height, i) => {
          const barPos = (i + 0.5) / BAR_COUNT;
          const isPast = barPos <= progress;
          return (
            <div
              key={i}
              className={`flex-1 rounded-[1px] transition-colors duration-200 ${
                isPast
                  ? "bg-bembe-teal"
                  : "bg-bembe-night/[0.08]"
              }`}
              style={{ height: `${height * 100}%` }}
            />
          );
        })}

        {/* Playhead — a walker's progress through the story */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-bembe-teal pointer-events-none transition-all duration-300"
          style={{ left: `${progress * 100}%` }}
        >
          {/* Glowing dot at the top of the playhead */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-bembe-teal shadow-sm shadow-bembe-teal/40" />
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-1.5 text-[11px] text-bembe-night/35 font-medium tabular-nums">
        <span>{formatTime(elapsedMs)}</span>
        <span>{formatTime(durationMs)}</span>
      </div>

      {/* Voice input — leave your trace at this moment */}
      {inputAnchorMs !== null && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-bembe-night/[0.06] shadow-sm">
          <div className="shrink-0 px-2 py-1 rounded-lg bg-bembe-coral/10 text-bembe-coral text-[11px] font-semibold tabular-nums">
            {formatTime(inputAnchorMs)}
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePost();
              if (e.key === "Escape") setInputAnchorMs(null);
            }}
            placeholder={t.comments.add}
            maxLength={280}
            autoFocus
            className="flex-1 text-sm text-bembe-night placeholder:text-bembe-night/25 bg-transparent outline-none"
          />
          <button
            onClick={handlePost}
            disabled={!inputText.trim() || posting}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-bembe-teal text-white disabled:opacity-25 transition-opacity shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setInputAnchorMs(null)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-bembe-night/30 hover:text-bembe-night/60 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
