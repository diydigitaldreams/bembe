"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Navigation,
  Star,
  MapPin,
  Play,
  User,
  Route,
  Loader2,
} from "lucide-react";
import type { ArtWalk, WalkStop, Profile } from "@/types";
import GiftButton from "@/components/gift-button";
import WalkReviews from "@/components/walk-reviews";
import { useI18n } from "@/lib/i18n/context";

interface WalkDetailClientProps {
  walk: ArtWalk & {
    artist?: Pick<Profile, "id" | "full_name" | "avatar_url" | "bio" | "location">;
    stops?: WalkStop[];
  };
  purchased?: boolean;
}

export default function WalkDetailClient({ walk, purchased }: WalkDetailClientProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const stops = walk.stops ?? [];
  const artist = walk.artist ?? { id: "", full_name: "Unknown Artist", location: null, bio: null };

  function formatPrice(cents: number): string {
    if (cents === 0) return t.walk.free;
    return `$${(cents / 100).toFixed(2)}`;
  }

  function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60);
    return `${mins} ${t.common.min}`;
  }

  return (
    <div className="min-h-dvh bg-bembe-sand">
      {/* Hero */}
      <div className="relative h-72 bg-gradient-to-br from-bembe-teal via-bembe-teal/80 to-bembe-coral/60">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />

        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
          <Link
            href="/discover"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              {walk.neighborhood}
            </span>
            {walk.is_featured && (
              <span className="inline-block px-2.5 py-1 rounded-full bg-bembe-gold/30 text-white text-xs font-medium backdrop-blur-sm">
                {t.walk.featured}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-1">
            {walk.title}
          </h1>
          <p className="text-white/70 text-sm">{walk.municipality}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-4 relative z-10">
        {/* Stats card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-4 mb-5">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <Clock className="h-5 w-5 text-bembe-teal mx-auto mb-1" />
              <p className="text-sm font-semibold text-bembe-night">
                {walk.duration_minutes}
              </p>
              <p className="text-xs text-bembe-night/50">{t.common.min}</p>
            </div>
            <div>
              <Navigation className="h-5 w-5 text-bembe-teal mx-auto mb-1" />
              <p className="text-sm font-semibold text-bembe-night">
                {walk.distance_km}
              </p>
              <p className="text-xs text-bembe-night/50">{t.common.km}</p>
            </div>
            <div>
              <Star className="h-5 w-5 text-bembe-gold fill-bembe-gold mx-auto mb-1" />
              <p className="text-sm font-semibold text-bembe-night">
                {walk.avg_rating}
              </p>
              <p className="text-xs text-bembe-night/50">{t.walk.rating}</p>
            </div>
            <div>
              <Route className="h-5 w-5 text-bembe-teal mx-auto mb-1" />
              <p className="text-sm font-semibold text-bembe-night">
                {stops.length}
              </p>
              <p className="text-xs text-bembe-night/50">{t.walk.stops}</p>
            </div>
          </div>
        </div>

        {/* Artist */}
        <div className="mb-6">
          <Link
            href={`/artist/${artist.id}`}
            className="flex items-center gap-3 group"
          >
            <div className="h-12 w-12 rounded-full bg-bembe-gold/20 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-bembe-gold" />
            </div>
            <div>
              <p className="font-semibold text-bembe-night group-hover:text-bembe-teal transition-colors">
                {artist.full_name}
              </p>
              <p className="text-sm text-bembe-night/50">{artist.location}</p>
            </div>
          </Link>
          {artist.bio && (
            <p className="mt-3 text-sm text-bembe-night/60 leading-relaxed">
              {artist.bio}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-bembe-night mb-2">
            {t.walk.about}
          </h2>
          <p className="text-sm text-bembe-night/70 leading-relaxed">
            {walk.description}
          </p>
        </div>

        {/* Stops */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-bembe-night mb-4">
            {stops.length} {t.walk.stops}
          </h2>
          <div className="space-y-0">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bembe-teal text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < stops.length - 1 && (
                    <div className="w-0.5 flex-1 bg-bembe-teal/20 my-1" />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <h3 className="font-semibold text-bembe-night text-sm leading-tight">
                    {stop.title}
                  </h3>
                  <p className="text-xs text-bembe-night/50 mt-0.5 mb-1.5">
                    {formatDuration(stop.duration_seconds)}
                  </p>
                  <p className="text-sm text-bembe-night/60 leading-relaxed">
                    {stop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-32">
          <WalkReviews walkId={walk.id} totalPlays={walk.total_plays} />
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-xl border-t border-bembe-night/5 px-5 pb-[env(safe-area-inset-bottom,16px)] pt-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-bembe-night/50 uppercase tracking-wider font-medium">
              {walk.price_cents === 0 ? t.walk.free_walk : t.walk.walk_price}
            </p>
            <p className="text-xl font-bold text-bembe-night">
              {formatPrice(walk.price_cents)}
            </p>
          </div>
          <GiftButton
            walkId={walk.id}
            walkTitle={walk.title}
            priceCents={walk.price_cents}
          />
          {walk.price_cents === 0 || purchased ? (
            <Link
              href={`/walk/${walk.id}/play`}
              className="flex items-center gap-2 h-14 px-8 rounded-2xl bg-bembe-teal text-white font-semibold transition-all hover:bg-bembe-teal/90 active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-white" />
              {walk.price_cents === 0 ? t.walk.start : t.walk.play}
            </Link>
          ) : (
            <button
              disabled={checkoutLoading}
              onClick={async () => {
                setCheckoutLoading(true);
                try {
                  const res = await fetch(`/api/walks/${walk.id}/checkout`, {
                    method: "POST",
                  });
                  const data = await res.json();
                  if (data.url) {
                    router.push(data.url);
                  } else {
                    console.error("Checkout error:", data.error);
                    setCheckoutLoading(false);
                  }
                } catch (err) {
                  console.error("Checkout error:", err);
                  setCheckoutLoading(false);
                }
              }}
              className="flex items-center gap-2 h-14 px-8 rounded-2xl bg-bembe-teal text-white font-semibold transition-all hover:bg-bembe-teal/90 active:scale-[0.98] disabled:opacity-60"
            >
              {checkoutLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5 fill-white" />
              )}
              {t.walk.purchase}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
