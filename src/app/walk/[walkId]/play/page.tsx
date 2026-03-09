"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { use, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import {
  ChevronLeft,
  Play,
  Pause,
  SkipForward,
  MapPin,
  Navigation,
  Volume2,
  Locate,
} from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useI18n } from "@/lib/i18n/context";
import WaveformComments from "@/components/waveform-comments";
import type { WalkStop } from "@/types";

// ---------- Helpers ----------

function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------- Component ----------

export default function WalkPlayerPage({
  params,
}: {
  params: Promise<{ walkId: string }>;
}) {
  const { walkId } = use(params);
  const { t } = useI18n();
  const [walkTitle, setWalkTitle] = useState("");
  const [stops, setStops] = useState<WalkStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [walkComplete, setWalkComplete] = useState(false);

  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const geo = useGeolocation(true);
  const totalStops = stops.length;

  // Fetch walk data from API
  useEffect(() => {
    async function fetchWalk() {
      try {
        const res = await fetch(`/api/walks/${walkId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.walk) {
            setWalkTitle(data.walk.title);
            if (data.walk.stops?.length > 0) {
              setStops(data.walk.stops);
            }
          }
        }
      } catch { /* fetch failed */ }
      setLoading(false);
    }
    fetchWalk();
  }, [walkId]);

  // Loading / empty guard
  if (loading) {
    return (
      <div className="min-h-dvh bg-bembe-sand flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-bembe-teal/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <Play className="h-6 w-6 text-bembe-teal" />
          </div>
          <p className="text-sm text-bembe-night/50">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (stops.length === 0) {
    return (
      <div className="min-h-dvh bg-bembe-sand flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-bembe-night/60">{t.walk.stops} not found</p>
        <Link href={`/walk/${walkId}`} className="text-bembe-teal font-medium">
          {t.common.close}
        </Link>
      </div>
    );
  }

  const currentStop = stops[currentStopIndex];

  // Auto-advance when user enters trigger radius
  useEffect(() => {
    if (!geo.lat || !geo.lng || walkComplete) return;

    const dist = getDistanceMeters(
      geo.lat,
      geo.lng,
      currentStop.lat,
      currentStop.lng
    );

    if (dist <= currentStop.trigger_radius_meters) {
      // Auto-play when arriving at a stop
      if (!isPlaying) {
        setIsPlaying(true);
        setElapsed(0);
      }
    }

    // Check if near next stop
    if (currentStopIndex < totalStops - 1) {
      const nextStop = stops[currentStopIndex + 1];
      const distToNext = getDistanceMeters(
        geo.lat,
        geo.lng,
        nextStop.lat,
        nextStop.lng
      );
      if (distToNext <= nextStop.trigger_radius_meters) {
        handleNextStop();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.lat, geo.lng, currentStopIndex, walkComplete, stops]);

  // Audio timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= currentStop.duration_seconds) {
            setIsPlaying(false);
            return currentStop.duration_seconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStop.duration_seconds]);

  // Mini map
  useEffect(() => {
    if (!showMap || !miniMapRef.current || miniMapInstance.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: miniMapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [currentStop.lng, currentStop.lat],
      zoom: 15,
      interactive: true,
      attributionControl: false,
    });

    // Add stop markers
    stops.forEach((stop, i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 28px; height: 28px; border-radius: 50%;
        background: ${i === currentStopIndex ? "#1A7A6D" : "#D4A843"};
        border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 12px; font-weight: bold;
      `;
      el.textContent = String(i + 1);

      new mapboxgl.Marker({ element: el })
        .setLngLat([stop.lng, stop.lat])
        .addTo(map);
    });

    // Draw route line
    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: stops.map((s) => [s.lng, s.lat]),
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1A7A6D",
          "line-width": 3,
          "line-opacity": 0.6,
          "line-dasharray": [2, 2],
        },
      });
    });

    miniMapInstance.current = map;

    return () => {
      map.remove();
      miniMapInstance.current = null;
    };
  }, [showMap]);

  // Update user marker on mini map
  useEffect(() => {
    if (!miniMapInstance.current || !geo.lat || !geo.lng) return;

    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 16px; height: 16px; border-radius: 50%;
        background: #E85D4A; border: 3px solid white;
        box-shadow: 0 0 0 3px rgba(232,93,74,0.3), 0 1px 4px rgba(0,0,0,0.3);
      `;
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([geo.lng, geo.lat])
        .addTo(miniMapInstance.current);
    } else {
      userMarkerRef.current.setLngLat([geo.lng, geo.lat]);
    }
  }, [geo.lat, geo.lng]);

  const handleNextStop = useCallback(() => {
    if (currentStopIndex < totalStops - 1) {
      setCurrentStopIndex((prev) => prev + 1);
      setElapsed(0);
      setIsPlaying(false);

      // Pan mini map to next stop
      const next = stops[currentStopIndex + 1];
      miniMapInstance.current?.flyTo({
        center: [next.lng, next.lat],
        zoom: 15,
        duration: 800,
      });
    } else {
      setWalkComplete(true);
      setIsPlaying(false);
    }
  }, [currentStopIndex, totalStops]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Walk complete screen
  if (walkComplete) {
    return (
      <div className="min-h-dvh bg-bembe-sand flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-bembe-teal/10 flex items-center justify-center mb-6">
          <Navigation className="h-10 w-10 text-bembe-teal" />
        </div>
        <h1 className="text-2xl font-bold text-bembe-night mb-2">
          {t.player.completed_title}
        </h1>
        <p className="text-bembe-night/60 mb-8 max-w-xs">
          {t.player.completed_desc}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href={`/walk/${walkId}`}
            className="flex items-center justify-center h-14 rounded-2xl bg-bembe-teal text-white font-semibold"
          >
            {t.player.leave_review}
          </Link>
          <Link
            href="/map"
            className="flex items-center justify-center h-14 rounded-2xl border-2 border-bembe-night/10 text-bembe-night font-semibold"
          >
            {t.player.explore_more}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-bembe-sand overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-4 pt-[env(safe-area-inset-top,12px)] pb-3 bg-white/80 backdrop-blur-xl border-b border-bembe-night/5">
        <Link
          href={`/walk/${walkId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-bembe-night/5 text-bembe-night"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-bembe-night/50 uppercase tracking-wider font-medium">
            {t.player.now_walking}
          </p>
          <p className="text-sm font-semibold text-bembe-night truncate">
            {walkTitle}
          </p>
        </div>
        <button
          onClick={() => setShowMap((prev) => !prev)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            showMap
              ? "bg-bembe-teal text-white"
              : "bg-bembe-night/5 text-bembe-night"
          }`}
        >
          <MapPin className="h-5 w-5" />
        </button>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Mini map (collapsible) */}
        {showMap && (
          <div className="relative h-48 bg-bembe-night/5">
            <div ref={miniMapRef} className="h-full w-full" />
            {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
              <div className="absolute inset-0 flex items-center justify-center bg-bembe-night/5">
                <p className="text-xs text-bembe-night/40">
                  Set NEXT_PUBLIC_MAPBOX_TOKEN to enable map
                </p>
              </div>
            )}
            {/* GPS info badge */}
            {geo.isTracking && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow text-xs">
                <Locate className="h-3 w-3 text-bembe-coral" />
                <span className="text-bembe-night/70">
                  {geo.accuracy ? `${Math.round(geo.accuracy)}${t.player.distance_unit} ${t.player.accuracy}` : t.player.locating}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Stop counter */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {stops.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentStopIndex
                      ? "w-6 bg-bembe-teal"
                      : i === currentStopIndex
                      ? "w-8 bg-bembe-teal"
                      : "w-4 bg-bembe-night/10"
                  }`}
                />
              ))}
            </div>
            <span className="ml-auto text-xs text-bembe-night/50 font-medium">
              {t.player.stop_label} {currentStopIndex + 1} {t.player.stop_of} {totalStops}
            </span>
          </div>
        </div>

        {/* Stop image area */}
        <div className="px-5 mb-4">
          <div className="h-44 rounded-2xl bg-gradient-to-br from-bembe-teal/20 via-bembe-gold/10 to-bembe-coral/10 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-2">
                <MapPin className="h-8 w-8 text-bembe-teal" />
              </div>
              <p className="text-xs text-bembe-night/40">{t.player.stop_image}</p>
            </div>
          </div>
        </div>

        {/* Stop info */}
        <div className="px-5 pb-6">
          <h2 className="text-xl font-bold text-bembe-night leading-tight mb-2">
            {currentStop.title}
          </h2>
          <p className="text-sm text-bembe-night/60 leading-relaxed">
            {currentStop.description}
          </p>

          {/* Distance to stop */}
          {geo.lat && geo.lng && (
            <div className="mt-4 flex items-center gap-2 text-xs text-bembe-night/50">
              <Navigation className="h-3.5 w-3.5" />
              <span>
                {Math.round(
                  getDistanceMeters(
                    geo.lat,
                    geo.lng,
                    currentStop.lat,
                    currentStop.lng
                  )
                )}
                {t.player.distance_unit} {t.player.distance_away}
              </span>
            </div>
          )}

          {geo.error && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-bembe-coral/10 text-bembe-coral text-xs">
              {geo.error}
            </div>
          )}
        </div>
      </div>

      {/* Audio player controls (bottom) */}
      <div className="shrink-0 bg-white border-t border-bembe-night/5 px-5 pt-4 pb-[env(safe-area-inset-bottom,16px)]">
        {/* Waveform with timed voices from fellow walkers */}
        <div className="mb-3">
          <WaveformComments
            stopId={currentStop.id}
            durationSeconds={currentStop.duration_seconds}
            elapsed={elapsed}
            onSeek={(s) => setElapsed(s)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="flex h-10 w-10 items-center justify-center text-bembe-night/40">
            <Volume2 className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Play / Pause */}
            <button
              onClick={togglePlayPause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-bembe-teal text-white shadow-lg shadow-bembe-teal/30 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 fill-white" />
              ) : (
                <Play className="h-7 w-7 fill-white ml-1" />
              )}
            </button>

            {/* Next stop */}
            <button
              onClick={handleNextStop}
              disabled={currentStopIndex >= totalStops - 1 && elapsed < currentStop.duration_seconds}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-bembe-night/5 text-bembe-night disabled:opacity-30 transition-opacity"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="w-10" /> {/* spacer for centering */}
        </div>

        {/* Next stop preview */}
        {currentStopIndex < totalStops - 1 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-bembe-night/[0.03]">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bembe-gold/20 text-bembe-gold text-xs font-bold shrink-0">
              {currentStopIndex + 2}
            </div>
            <p className="text-xs text-bembe-night/50 truncate">
              {t.player.next_prefix}: {stops[currentStopIndex + 1].title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
