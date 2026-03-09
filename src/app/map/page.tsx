"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, Navigation, Star, DollarSign, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { ArtWalk } from "@/types";

const MOCK_WALKS: ArtWalk[] = [
  {
    id: "walk-santurce",
    artist_id: "artist-1",
    title: "Santurce Es Ley",
    description:
      "Explore the vibrant street art and galleries of Santurce, Puerto Rico's creative heartbeat. From murals to hidden courtyards, discover the stories behind the art.",
    cover_image_url: "/walks/santurce.jpg",
    price_cents: 1499,
    duration_minutes: 75,
    distance_km: 2.4,
    neighborhood: "Santurce",
    municipality: "San Juan",
    is_published: true,
    is_featured: true,
    total_plays: 342,
    avg_rating: 4.8,
    created_at: "2025-01-15",
    artist: {
      id: "artist-1",
      email: "marina@bembe.art",
      full_name: "Marina Del Valle",
      avatar_url: null,
      role: "artist",
      bio: "Visual artist and storyteller from Santurce",
      location: "Santurce, PR",
      lat: 18.4468,
      lng: -66.0614,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
  {
    id: "walk-old-san-juan",
    artist_id: "artist-2",
    title: "Adoquines y Leyendas",
    description:
      "Walk the cobblestone streets of Old San Juan and hear centuries-old legends. From El Morro to the hidden plazas.",
    cover_image_url: "/walks/old-sj.jpg",
    price_cents: 0,
    duration_minutes: 90,
    distance_km: 3.1,
    neighborhood: "Viejo San Juan",
    municipality: "San Juan",
    is_published: true,
    is_featured: true,
    total_plays: 891,
    avg_rating: 4.9,
    created_at: "2025-02-10",
    artist: {
      id: "artist-2",
      email: "carlos@bembe.art",
      full_name: "Carlos Ruiz Medina",
      avatar_url: null,
      role: "artist",
      bio: "Historian and musician",
      location: "Viejo San Juan, PR",
      lat: 18.4655,
      lng: -66.1057,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
  {
    id: "walk-ponce",
    artist_id: "artist-3",
    title: "Ponce: Perla del Sur",
    description:
      "Discover the architectural grandeur and artistic traditions of the Pearl of the South. Art Deco, neoclassical, and contemporary.",
    cover_image_url: "/walks/ponce.jpg",
    price_cents: 999,
    duration_minutes: 60,
    distance_km: 1.8,
    neighborhood: "Centro Historico",
    municipality: "Ponce",
    is_published: true,
    is_featured: false,
    total_plays: 156,
    avg_rating: 4.6,
    created_at: "2025-03-01",
    artist: {
      id: "artist-3",
      email: "lucia@bembe.art",
      full_name: "Lucia Torres",
      avatar_url: null,
      role: "artist",
      bio: "Architect turned art guide",
      location: "Ponce, PR",
      lat: 18.0115,
      lng: -66.6141,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
  {
    id: "walk-rincon",
    artist_id: "artist-4",
    title: "Rincon: Sunset Canvas",
    description:
      "Follow the coast of Rincon and experience the intersection of surf culture, local art, and Caribbean sunsets.",
    cover_image_url: "/walks/rincon.jpg",
    price_cents: 799,
    duration_minutes: 50,
    distance_km: 2.0,
    neighborhood: "Pueblo",
    municipality: "Rincon",
    is_published: true,
    is_featured: false,
    total_plays: 98,
    avg_rating: 4.7,
    created_at: "2025-04-01",
    artist: {
      id: "artist-4",
      email: "rafael@bembe.art",
      full_name: "Rafael Mora",
      avatar_url: null,
      role: "artist",
      bio: "Surfer, painter, and storyteller",
      location: "Rincon, PR",
      lat: 18.3403,
      lng: -67.2500,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
  {
    id: "walk-condado",
    artist_id: "artist-5",
    title: "Condado Art Deco",
    description:
      "A sophisticated stroll through Condado's beachside architecture, boutique galleries, and hidden murals.",
    cover_image_url: "/walks/condado.jpg",
    price_cents: 1299,
    duration_minutes: 45,
    distance_km: 1.5,
    neighborhood: "Condado",
    municipality: "San Juan",
    is_published: true,
    is_featured: false,
    total_plays: 210,
    avg_rating: 4.5,
    created_at: "2025-05-15",
    artist: {
      id: "artist-5",
      email: "diana@bembe.art",
      full_name: "Diana Ramos",
      avatar_url: null,
      role: "artist",
      bio: "Interior designer with a love for Art Deco",
      location: "Condado, PR",
      lat: 18.4577,
      lng: -66.0700,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
  {
    id: "walk-bayamon",
    artist_id: "artist-6",
    title: "Bayamon: Raices Tainas",
    description:
      "Trace the indigenous Taino heritage through Bayamon's parks, museums, and public art installations.",
    cover_image_url: "/walks/bayamon.jpg",
    price_cents: 0,
    duration_minutes: 55,
    distance_km: 2.2,
    neighborhood: "Centro",
    municipality: "Bayamon",
    is_published: true,
    is_featured: false,
    total_plays: 178,
    avg_rating: 4.4,
    created_at: "2025-06-01",
    artist: {
      id: "artist-6",
      email: "pedro@bembe.art",
      full_name: "Pedro Colon",
      avatar_url: null,
      role: "artist",
      bio: "Sculptor and cultural educator",
      location: "Bayamon, PR",
      lat: 18.3985,
      lng: -66.1553,
      is_act60: false,
      stripe_account_id: null,
      stripe_customer_id: null,
      created_at: "2025-01-01",
    },
  },
];

const WALK_COORDS: Record<string, [number, number]> = {
  "walk-santurce": [-66.0614, 18.4468],
  "walk-old-san-juan": [-66.1165, 18.4663],
  "walk-ponce": [-66.6141, 18.0115],
  "walk-rincon": [-67.2500, 18.3403],
  "walk-condado": [-66.0700, 18.4577],
  "walk-bayamon": [-66.1553, 18.3985],
};

export default function MapPage() {
  const { t } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedWalk, setSelectedWalk] = useState<ArtWalk | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMarkerClick = useCallback((walk: ArtWalk) => {
    setSelectedWalk(walk);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
      return;
    }

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

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    MOCK_WALKS.forEach((walk) => {
      const coords = WALK_COORDS[walk.id];
      if (!coords) return;

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
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
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
  }, [mapLoaded, handleMarkerClick]);

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
