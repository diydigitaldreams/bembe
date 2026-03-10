"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, MapPinned, X, Loader2, Headphones } from "lucide-react";
import Navbar from "@/components/navbar";
import WalkCard from "@/components/walk-card";
import type { ArtWalk } from "@/types";
import { useI18n } from "@/lib/i18n/context";

function getFilterChips(t: ReturnType<typeof useI18n>["t"]) {
  return [
    { key: "free", label: t.discover.filter_free },
    { key: "santurce", label: "Santurce" },
    { key: "old-san-juan", label: "Old San Juan" },
    { key: "ponce", label: "Ponce" },
    { key: "rincon", label: "Rincon" },
    { key: "music", label: t.discover.filter_music },
    { key: "visual-art", label: t.discover.filter_visual },
    { key: "history", label: t.discover.filter_history },
  ];
}

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
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [walks, setWalks] = useState<ArtWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const filterChips = getFilterChips(t);

  useEffect(() => {
    async function fetchWalks() {
      try {
        const res = await fetch("/api/walks?limit=50");
        const data = await res.json();
        if (data.walks && data.walks.length > 0) {
          setWalks(data.walks);
        }
      } catch {
        // API failed — walks stays empty
      } finally {
        setLoading(false);
      }
    }
    fetchWalks();
  }, []);

  function toggleFilter(key: string) {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }

  const filteredWalks = useMemo(() => {
    let result = walks;

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
  }, [search, activeFilters, walks]);

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bembe-night sm:text-4xl">
            {t.discover.title}
          </h1>
          <p className="mt-2 text-bembe-night/50">
            {t.discover.subtitle}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <label htmlFor="walk-search" className="sr-only">{t.discover.search_placeholder}</label>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bembe-night/30" />
          <input
            id="walk-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.discover.search_placeholder}
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
              {t.discover.clear_filters}
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-bembe-night/40">
          {filteredWalks.length} {t.discover.walks_found}
        </p>

        {/* Walk grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-bembe-teal" />
          </div>
        ) : filteredWalks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWalks.map((walk) => (
              <WalkCard key={walk.id} walk={walk} />
            ))}
          </div>
        ) : walks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bembe-teal/10">
              <Headphones className="h-8 w-8 text-bembe-teal" />
            </div>
            <h3 className="text-lg font-semibold text-bembe-night/70">
              {t.discover.no_walks_title}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-bembe-night/40">
              {t.discover.no_walks_subtitle}
            </p>
            <Link
              href="/for-artists"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-bembe-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90"
            >
              {t.discover.empty_cta}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-bembe-night/15" />
            <h3 className="text-lg font-semibold text-bembe-night/60">
              {t.discover.empty_title}
            </h3>
            <p className="mt-1 text-sm text-bembe-night/40">
              {t.discover.empty_subtitle}
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
        {t.discover.view_map}
      </Link>
    </div>
  );
}
