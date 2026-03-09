"use client";

import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import type { ArtWalk } from "@/types";
import { useI18n } from "@/lib/i18n/context";

const gradients = [
  "from-bembe-teal to-emerald-400",
  "from-bembe-coral to-orange-400",
  "from-bembe-gold to-amber-300",
  "from-indigo-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-cyan-500 to-blue-400",
  "from-bembe-teal to-cyan-400",
  "from-bembe-coral to-rose-400",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < full ? "fill-bembe-gold text-bembe-gold" : "fill-none text-bembe-night/20"
        }`}
      />
    );
  }
  return stars;
}

interface WalkCardProps {
  walk: ArtWalk;
}

export default function WalkCard({ walk }: WalkCardProps) {
  const { t } = useI18n();
  const priceLabel =
    walk.price_cents === 0
      ? t.discover.free
      : `$${(walk.price_cents / 100).toFixed(2)}`;

  return (
    <Link
      href={`/walk/${walk.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-bembe-night/5 transition-all hover:shadow-lg hover:ring-bembe-teal/20"
    >
      {/* Cover image placeholder */}
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${getGradient(walk.id)}`}
      >
        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5" />
        {/* Neighborhood tag */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-bembe-night backdrop-blur-sm">
          {walk.neighborhood}
        </span>
        {/* Price tag */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm ${
            walk.price_cents === 0
              ? "bg-bembe-teal/90 text-white"
              : "bg-white/90 text-bembe-night"
          }`}
        >
          {priceLabel}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold leading-snug text-bembe-night group-hover:text-bembe-teal transition-colors">
          {walk.title}
        </h3>
        <p className="text-sm text-bembe-night/60">
          {walk.artist?.full_name ?? "Unknown Artist"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">{renderStars(walk.avg_rating)}</div>
          <span className="text-xs font-medium text-bembe-night/50">
            {walk.avg_rating.toFixed(1)}
          </span>
        </div>

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-bembe-night/50">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {walk.duration_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {walk.distance_km.toFixed(1)} km
          </span>
        </div>
      </div>
    </Link>
  );
}
