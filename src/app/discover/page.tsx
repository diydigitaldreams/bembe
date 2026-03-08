"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPinned, X } from "lucide-react";
import Navbar from "@/components/navbar";
import WalkCard from "@/components/walk-card";
import type { ArtWalk } from "@/types";

const mockWalks: ArtWalk[] = [
  {
    id: "w1-santurce-murals",
    artist_id: "a1",
    title: "Santurce Murals: Color of Resistance",
    description: "A walking journey through the vibrant street art of Santurce.",
    cover_image_url: "",
    price_cents: 499,
    duration_minutes: 45,
    distance_km: 1.8,
    neighborhood: "Santurce",
    municipality: "San Juan",
    is_published: true,
    is_featured: true,
    total_plays: 1243,
    avg_rating: 4.8,
    created_at: "2025-01-15",
    artist: {
      id: "a1", email: "yara@bembe.art", full_name: "Yara Montilla",
      avatar_url: null, role: "artist", bio: null, location: "Santurce",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w2-viejo-san-juan",
    artist_id: "a2",
    title: "Old San Juan: Whispers of the Adoquines",
    description: "Listen to five centuries of history beneath your feet.",
    cover_image_url: "",
    price_cents: 0,
    duration_minutes: 60,
    distance_km: 2.3,
    neighborhood: "Old San Juan",
    municipality: "San Juan",
    is_published: true,
    is_featured: true,
    total_plays: 2567,
    avg_rating: 4.9,
    created_at: "2025-02-10",
    artist: {
      id: "a2", email: "carlos@bembe.art", full_name: "Carlos Vega",
      avatar_url: null, role: "artist", bio: null, location: "Old San Juan",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w3-ponce-heritage",
    artist_id: "a3",
    title: "Ponce: The Pearl of the South",
    description: "Architecture, plazas, and Ponce's legendary cultural pride.",
    cover_image_url: "",
    price_cents: 399,
    duration_minutes: 50,
    distance_km: 2.0,
    neighborhood: "Ponce Centro",
    municipality: "Ponce",
    is_published: true,
    is_featured: true,
    total_plays: 890,
    avg_rating: 4.6,
    created_at: "2025-03-05",
    artist: {
      id: "a3", email: "lina@bembe.art", full_name: "Lina Beauchamp",
      avatar_url: null, role: "artist", bio: null, location: "Ponce",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w4-rincon-surf",
    artist_id: "a4",
    title: "Rincon Surf & Sound Walk",
    description: "Ocean breezes and local surf culture narrated by a Rincon native.",
    cover_image_url: "",
    price_cents: 0,
    duration_minutes: 35,
    distance_km: 1.5,
    neighborhood: "Rincon",
    municipality: "Rincon",
    is_published: true,
    is_featured: false,
    total_plays: 432,
    avg_rating: 4.5,
    created_at: "2025-04-01",
    artist: {
      id: "a4", email: "mavi@bembe.art", full_name: "Mavi Torres",
      avatar_url: null, role: "artist", bio: null, location: "Rincon",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w5-santurce-music",
    artist_id: "a5",
    title: "Santurce Beats: A Musical Journey",
    description: "From salsa bars to reggaeton studios. Hear the neighborhood that never sleeps.",
    cover_image_url: "",
    price_cents: 599,
    duration_minutes: 55,
    distance_km: 2.1,
    neighborhood: "Santurce",
    municipality: "San Juan",
    is_published: true,
    is_featured: false,
    total_plays: 1102,
    avg_rating: 4.7,
    created_at: "2025-04-15",
    artist: {
      id: "a5", email: "dj@bembe.art", full_name: "DJ Raices",
      avatar_url: null, role: "artist", bio: null, location: "Santurce",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w6-condado-art-deco",
    artist_id: "a6",
    title: "Condado Art Deco Treasures",
    description: "A visual feast of mid-century architecture along the lagoon.",
    cover_image_url: "",
    price_cents: 299,
    duration_minutes: 40,
    distance_km: 1.6,
    neighborhood: "Condado",
    municipality: "San Juan",
    is_published: true,
    is_featured: false,
    total_plays: 675,
    avg_rating: 4.4,
    created_at: "2025-05-01",
    artist: {
      id: "a6", email: "arq@bembe.art", full_name: "Ana Rios",
      avatar_url: null, role: "artist", bio: null, location: "Condado",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w7-loiza-traditions",
    artist_id: "a7",
    title: "Loiza: Afro-Boricua Roots",
    description: "Bomba, vejigantes, and the living traditions of Loiza.",
    cover_image_url: "",
    price_cents: 0,
    duration_minutes: 50,
    distance_km: 1.9,
    neighborhood: "Loiza",
    municipality: "Loiza",
    is_published: true,
    is_featured: false,
    total_plays: 1890,
    avg_rating: 4.9,
    created_at: "2025-05-20",
    artist: {
      id: "a7", email: "bomba@bembe.art", full_name: "Miguel Cepeda",
      avatar_url: null, role: "artist", bio: null, location: "Loiza",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
  {
    id: "w8-old-sj-history",
    artist_id: "a8",
    title: "Fortaleza to El Morro: A History Walk",
    description: "From the governor's mansion to the Atlantic fortress, 500 years in one walk.",
    cover_image_url: "",
    price_cents: 699,
    duration_minutes: 75,
    distance_km: 3.2,
    neighborhood: "Old San Juan",
    municipality: "San Juan",
    is_published: true,
    is_featured: false,
    total_plays: 3210,
    avg_rating: 4.8,
    created_at: "2025-06-01",
    artist: {
      id: "a8", email: "prof@bembe.art", full_name: "Prof. Isabel Colon",
      avatar_url: null, role: "artist", bio: null, location: "Old San Juan",
      lat: null, lng: null, is_act60: false, stripe_account_id: null,
      stripe_customer_id: null, created_at: "2025-01-01",
    },
  },
];

const filterChips = [
  { key: "free", label: "Free" },
  { key: "santurce", label: "Santurce" },
  { key: "old-san-juan", label: "Old San Juan" },
  { key: "ponce", label: "Ponce" },
  { key: "rincon", label: "Rincon" },
  { key: "music", label: "Music" },
  { key: "visual-art", label: "Visual Art" },
  { key: "history", label: "History" },
];

function matchesFilter(walk: ArtWalk, filter: string): boolean {
  switch (filter) {
    case "free":
      return walk.price_cents === 0;
    case "santurce":
      return walk.neighborhood.toLowerCase() === "santurce";
    case "old-san-juan":
      return walk.neighborhood.toLowerCase() === "old san juan";
    case "ponce":
      return walk.municipality.toLowerCase() === "ponce";
    case "rincon":
      return walk.neighborhood.toLowerCase() === "rincon" || walk.municipality.toLowerCase() === "rincon";
    case "music":
      return /music|beat|sound|salsa|reggaeton|bomba/i.test(walk.title + walk.description);
    case "visual-art":
      return /mural|art|visual|deco|color/i.test(walk.title + walk.description);
    case "history":
      return /history|heritage|centuries|fortress|adoquines|tradition/i.test(walk.title + walk.description);
    default:
      return true;
  }
}

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  function toggleFilter(key: string) {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }

  const filteredWalks = useMemo(() => {
    let result = mockWalks;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.neighborhood.toLowerCase().includes(q) ||
          w.municipality.toLowerCase().includes(q) ||
          (w.artist?.full_name ?? "").toLowerCase().includes(q)
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter((w) =>
        activeFilters.some((f) => matchesFilter(w, f))
      );
    }

    return result;
  }, [search, activeFilters]);

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bembe-night sm:text-4xl">
            Discover Walks
          </h1>
          <p className="mt-2 text-bembe-night/50">
            Audio art experiences across Puerto Rico.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bembe-night/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search walks, artists, neighborhoods..."
            className="w-full rounded-xl border border-bembe-night/10 bg-white py-3.5 pl-12 pr-10 text-sm text-bembe-night placeholder:text-bembe-night/30 focus:border-bembe-teal/40 focus:outline-none focus:ring-2 focus:ring-bembe-teal/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-bembe-night/30 hover:text-bembe-night/60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filterChips.map((chip) => {
            const active = activeFilters.includes(chip.key);
            return (
              <button
                key={chip.key}
                onClick={() => toggleFilter(chip.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-bembe-teal text-white shadow-sm"
                    : "bg-white text-bembe-night/60 ring-1 ring-bembe-night/10 hover:ring-bembe-teal/30 hover:text-bembe-teal"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="rounded-full px-4 py-2 text-sm font-medium text-bembe-coral hover:text-bembe-coral/80 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-bembe-night/40">
          {filteredWalks.length} walk{filteredWalks.length !== 1 ? "s" : ""} found
        </p>

        {/* Walk grid */}
        {filteredWalks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWalks.map((walk) => (
              <WalkCard key={walk.id} walk={walk} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-bembe-night/15" />
            <h3 className="text-lg font-semibold text-bembe-night/60">
              No walks found
            </h3>
            <p className="mt-1 text-sm text-bembe-night/40">
              Try a different search term or clear your filters.
            </p>
          </div>
        )}
      </div>

      {/* Floating Map button */}
      <Link
        href="/map"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-bembe-night px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-bembe-night/90 hover:shadow-2xl"
      >
        <MapPinned className="h-4 w-4" />
        View on Map
      </Link>
    </div>
  );
}
