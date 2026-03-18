"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, Navigation, Star, DollarSign, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { ArtWalk } from "@/types";

const NEIGHBORHOOD_PINS = [
  { name: "Santurce", lat: 18.4468, lng: -66.0614 },
  { name: "Viejo San Juan", lat: 18.4663, lng: -66.1169 },
  { name: "Condado", lat: 18.4570, lng: -66.0710 },
  { name: "Ponce Centro", lat: 18.0111, lng: -66.6141 },
  { name: "Loíza", lat: 18.4313, lng: -65.8801 },
  { name: "Rincón", lat: 18.3401, lng: -67.2501 },
  { name: "Caguas", lat: 18.2388, lng: -66.0352 },
  { name: "Río Piedras", lat: 18.3994, lng: -66.0498 },
  { name: "Ocean Park", lat: 18.4530, lng: -66.0650 },
  { name: "Mayagüez", lat: 18.2013, lng: -67.1397 },
  { name: "Vieques", lat: 18.1263, lng: -65.4401 },
  { name: "Cabo Rojo", lat: 18.0866, lng: -67.1457 },
];

export default function MapPage() {
  const { t } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedWalk, setSelectedWalk] = useState<ArtWalk | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [walks, setWalks] = useState<ArtWalk[]>([]);

  const handleMarkerClick = useCallback((walk: ArtWalk) => {
    setSelectedWalk(walk);
  }, []);

  // Fetch walks from API
  useEffect(() => {
    async function fetchWalks() {
      try {
        const res = await fetch("/api/walks?limit=50");
        const data = await res.json();
        if (data.walks && data.walks.length > 0) {
          // For each walk, try to get coordinates from stops
          const walksWithCoords = await Promise.all(
            data.walks.map(async (walk: ArtWalk) => {
              if (walk.artist?.lat && walk.artist?.lng) return walk;
              // Fetch first stop for coordinates
              try {
                const stopRes = await fetch(`/api/walks/${walk.id}`);
                const stopData = await stopRes.json();
                if (stopData.walk?.stops?.length > 0) {
                  return { ...walk, stops: stopData.walk.stops };
                }
              } catch { /* skip */ }
              return walk;
            })
          );
          setWalks(walksWithCoords);
        }
      } catch {
        // API unavailable
      }
    }
    fetchWalks();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-66.59, 18.22],
      zoom: 9,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Place markers from fetched walks using artist lat/lng, or neighborhood pins if no walks
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (walks.length > 0) {
      walks.forEach((walk) => {
        // Use artist coordinates, then first stop, then skip
        let lat = walk.artist?.lat;
        let lng = walk.artist?.lng;
        if (!lat || !lng) {
          const firstStop = walk.stops?.[0];
          if (firstStop) {
            lat = firstStop.lat;
            lng = firstStop.lng;
          }
        }
        if (!lat || !lng) return;

        const coords: [number, number] = [lng, lat];

        // Custom marker element
        const el = document.createElement("div");
        el.className = "bembe-marker";
        el.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1A7A6D;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        `;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "white");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z");
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "10");
        circle.setAttribute("r", "3");
        svg.appendChild(path);
        svg.appendChild(circle);
        el.appendChild(svg);
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(mapRef.current!);

        el.addEventListener("click", () => {
          handleMarkerClick(walk);
          mapRef.current?.flyTo({
            center: coords,
            zoom: 13,
            duration: 1000,
          });
        });

        markersRef.current.push(marker);
      });
    } else {
      // No walks — show neighborhood pins as fallback
      NEIGHBORHOOD_PINS.forEach((pin) => {
        const coords: [number, number] = [pin.lng, pin.lat];

        const el = document.createElement("div");
        el.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #D4A843;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        `;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "white");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z");
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "10");
        circle.setAttribute("r", "3");
        svg.appendChild(path);
        svg.appendChild(circle);
        el.appendChild(svg);
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(mapRef.current!);

        el.addEventListener("click", () => {
          window.location.href = `/discover?neighborhood=${encodeURIComponent(pin.name)}`;
        });

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, walks, handleMarkerClick]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bembe-sand">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 pt-[env(safe-area-inset-top,12px)] pb-3 bg-gradient-to-b from-bembe-night/60 to-transparent">
        <Link
          href="/discover"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold text-white drop-shadow">
          {t.map.title}
        </h1>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* No token warning */}
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bembe-sand">
          <div className="text-center px-8">
            <MapPin className="h-12 w-12 text-bembe-teal mx-auto mb-4" />
            <h2 className="text-xl font-bold text-bembe-night mb-2">
              {t.map.no_token}
            </h2>
            <p className="text-bembe-night/60">
              {t.map.no_token_desc}
            </p>
          </div>
        </div>
      )}

      {/* Bottom sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 transition-transform duration-300 ease-out ${
          selectedWalk ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {selectedWalk && (
          <div className="mx-3 mb-3 rounded-2xl bg-white shadow-2xl shadow-bembe-night/20 overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setSelectedWalk(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-bembe-night/10"
            >
              <X className="h-4 w-4 text-bembe-night" />
            </button>

            {/* Cover image placeholder */}
            <div className="h-32 bg-gradient-to-br from-bembe-teal to-bembe-teal/70 flex items-end p-4">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium mb-1 backdrop-blur-sm">
                  {selectedWalk.municipality}
                </span>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {selectedWalk.title}
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              {/* Artist */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-bembe-gold/20 flex items-center justify-center text-bembe-gold text-sm font-bold">
                  {selectedWalk.artist?.full_name?.charAt(0) ?? "A"}
                </div>
                <span className="text-sm text-bembe-night/70">
                  {t.walk.by}{" "}
                  <span className="font-medium text-bembe-night">
                    {selectedWalk.artist?.full_name}
                  </span>
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-bembe-night/60 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedWalk.duration_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="h-3.5 w-3.5" />
                  {selectedWalk.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-bembe-gold fill-bembe-gold" />
                  {selectedWalk.avg_rating}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {selectedWalk.price_cents === 0 ? t.walk.free : `$${(selectedWalk.price_cents / 100).toFixed(2)}`}
                </span>
              </div>

              <p className="text-sm text-bembe-night/70 leading-relaxed mb-4 line-clamp-2">
                {selectedWalk.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/walk/${selectedWalk.id}`}
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-bembe-teal text-white font-semibold text-sm transition-colors hover:bg-bembe-teal/90"
                >
                  <Navigation className="h-4 w-4" />
                  {t.map.start_walk}
                </Link>
                <Link
                  href={`/walk/${selectedWalk.id}`}
                  className="flex items-center justify-center h-12 px-4 rounded-xl border-2 border-bembe-night/10 text-bembe-night/70 font-medium text-sm transition-colors hover:bg-bembe-night/5"
                >
                  {t.map.details}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
