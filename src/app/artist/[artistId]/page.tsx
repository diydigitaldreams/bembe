"use client";

import { use, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useSearchParams } from "next/navigation";
import { SubscribeButton } from "@/components/subscribe-button";
import TipModal from "@/components/tip-modal";
import { createClient } from "@/lib/supabase/client";
import type { ArtWalk } from "@/types";
import {
  ChevronLeft,
  MapPin,
  Star,
  Headphones,
  ExternalLink,
  Heart,
  Share2,
  Clock,
  Route,
  CheckCircle,
  Loader2,
} from "lucide-react";

const GRADIENTS = [
  "from-bembe-coral to-orange-400",
  "from-bembe-teal to-emerald-400",
  "from-purple-500 to-bembe-coral",
  "from-bembe-gold to-yellow-400",
  "from-bembe-teal to-blue-400",
];

function ArtistProfileInner({ artistId }: { artistId: string }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("subscribed") === "true";

  const [artist, setArtist] = useState<{
    id: string;
    full_name: string;
    bio: string | null;
    location: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [walks, setWalks] = useState<ArtWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [showTipToast, setShowTipToast] = useState(false);

  useEffect(() => {
    async function fetchArtist() {
      const supabase = createClient();

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, bio, location, avatar_url")
        .eq("id", artistId)
        .single();

      if (profile) setArtist(profile);

      const { data: walksData } = await supabase
        .from("art_walks")
        .select("*")
        .eq("artist_id", artistId)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (walksData) setWalks(walksData);
      setLoading(false);
    }
    fetchArtist();
  }, [artistId]);

  // Show success toast when redirected back from Stripe after tipping
  useEffect(() => {
    if (searchParams.get("tipped") === "true") {
      setShowTipToast(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("tipped");
      window.history.replaceState({}, "", url.toString());

      const timer = setTimeout(() => setShowTipToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bembe-sand flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-bembe-teal" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-bembe-sand flex flex-col items-center justify-center gap-4">
        <p className="text-bembe-night/60">{t.artist.not_found}</p>
        <Link href="/discover" className="text-bembe-teal font-medium">{t.discover.title}</Link>
      </div>
    );
  }

  const totalPlays = walks.reduce((sum, w) => sum + w.total_plays, 0);
  const avgRating = walks.length > 0
    ? (walks.reduce((sum, w) => sum + Number(w.avg_rating), 0) / walks.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Tip Success Toast */}
      {showTipToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              {t.tips.success} {artist.full_name.split(" ")[0]}!
            </span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-br from-bembe-night via-bembe-teal to-bembe-night text-white">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/discover"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: artist.full_name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  // Future: save to favorites
                }}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-bembe-coral to-bembe-gold flex items-center justify-center text-2xl font-bold"
            >
              {artist.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h1 className="text-xl font-bold">{artist.full_name}</h1>
              <div className="flex items-center gap-1 text-white/60 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {artist.location}
              </div>
            </div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed mb-4">
            {artist.bio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg">
                {totalPlays.toLocaleString()}
              </div>
              <div className="text-xs text-white/50">{t.artist.total_plays}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg">{walks.length}</div>
              <div className="text-xs text-white/50">{t.artist.walks}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-bembe-gold fill-bembe-gold" />
                {avgRating}
              </div>
              <div className="text-xs text-white/50">{t.artist.rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Walks */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="font-bold text-lg mb-4">
          {t.artist.art_walks} ({walks.length})
        </h2>

        <div className="space-y-3">
          {walks.map((walk, idx) => (
            <Link
              key={walk.id}
              href={`/walk/${walk.id}`}
              className="block bg-white rounded-xl overflow-hidden shadow-sm border border-bembe-night/5 hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div
                  className={`w-28 h-28 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} shrink-0 flex items-center justify-center`}
                >
                  <Headphones className="w-8 h-8 text-white/60" />
                </div>
                <div className="p-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {walk.title}
                  </h3>
                  <p className="text-xs text-bembe-night/50 line-clamp-2 mb-2">
                    {walk.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-bembe-night/40">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {walk.duration_minutes}m
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Route className="w-3 h-3" />
                      {walk.distance_km}km
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-bembe-gold text-bembe-gold" />
                      {walk.avg_rating}
                    </span>
                    <span className="ml-auto font-medium text-bembe-teal">
                      {walk.price_cents === 0
                        ? t.discover.free
                        : `$${(walk.price_cents / 100).toFixed(0)}`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Subscription Success Banner */}
        {justSubscribed && (
          <div className="mt-6 bg-bembe-gold/15 border border-bembe-gold/30 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-bembe-night">
              {t.subscription.success}
            </p>
          </div>
        )}

        {/* Support Card */}
        <div className="mt-8 bg-gradient-to-br from-bembe-teal to-emerald-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">
            {t.artist.support} {artist.full_name.split(" ")[0]}
          </h3>
          <p className="text-white/70 text-sm mb-4">
            {t.artist.support_desc}
          </p>
          <div className="flex flex-wrap gap-3">
            <SubscribeButton
              artistId={artistId}
              artistName={artist.full_name}
              isSubscribed={justSubscribed}
            />
            <button
              onClick={() => setTipModalOpen(true)}
              className="px-4 py-2 bg-white text-bembe-teal font-medium rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              {t.artist.send_tip}
            </button>
            <Link
              href={`/discover`}
              className="px-4 py-2 bg-white/10 text-white font-medium rounded-xl text-sm hover:bg-white/20 transition-colors"
            >
              {t.artist.gift_walk}
            </Link>
          </div>
          <p className="text-white/50 text-xs mt-3">
            {t.subscription.perks}
          </p>
        </div>
      </div>

      {/* Tip Modal */}
      <TipModal
        artistId={artistId}
        artistName={artist.full_name.split(" ")[0]}
        open={tipModalOpen}
        onClose={() => setTipModalOpen(false)}
      />
    </div>
  );
}

export default function ArtistProfilePage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = use(params);
  return (
    <Suspense>
      <ArtistProfileInner artistId={artistId} />
    </Suspense>
  );
}
