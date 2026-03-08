"use client";

import { use } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
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
} from "lucide-react";

const MOCK_ARTIST = {
  id: "1",
  full_name: "Isabella Torres Rivera",
  bio: "Muralista y narradora de historias de Santurce. Mis caminatas de arte te llevan por las calles que me criaron, compartiendo las voces de mi comunidad a traves del color y el sonido.",
  location: "Santurce, San Juan",
  avatar_gradient: "from-bembe-coral to-bembe-gold",
  total_plays: 3420,
  total_walks: 8,
  avg_rating: 4.8,
  joined: "January 2026",
};

const MOCK_WALKS = [
  {
    id: "1",
    title: "Murales de Santurce: Colores que Hablan",
    description:
      "Un recorrido por los murales mas iconicos de Santurce. Cada pared cuenta una historia de resistencia, amor y orgullo boricua.",
    duration_minutes: 45,
    distance_km: 1.8,
    price_cents: 1000,
    total_plays: 1250,
    avg_rating: 4.9,
    neighborhood: "Santurce",
    gradient: "from-bembe-coral to-orange-400",
  },
  {
    id: "2",
    title: "La Placita After Hours",
    description:
      "Experience La Placita's transformation from day market to nightlife hub through the eyes of the artists who painted its walls.",
    duration_minutes: 30,
    distance_km: 0.8,
    price_cents: 800,
    total_plays: 890,
    avg_rating: 4.7,
    neighborhood: "Santurce",
    gradient: "from-bembe-teal to-emerald-400",
  },
  {
    id: "3",
    title: "Women of Santurce: Hidden Stories",
    description:
      "Descubre las historias de las mujeres que construyeron Santurce — artistas, activistas y visionarias que transformaron el barrio.",
    duration_minutes: 55,
    distance_km: 2.1,
    price_cents: 1200,
    total_plays: 670,
    avg_rating: 4.9,
    neighborhood: "Santurce",
    gradient: "from-purple-500 to-bembe-coral",
  },
  {
    id: "free-1",
    title: "Mi Primer Santurce (Free Walk)",
    description:
      "A short intro to Santurce for first-time visitors. Perfect starting point before the deeper walks.",
    duration_minutes: 15,
    distance_km: 0.5,
    price_cents: 0,
    total_plays: 610,
    avg_rating: 4.6,
    neighborhood: "Santurce",
    gradient: "from-bembe-gold to-yellow-400",
  },
];

export default function ArtistProfilePage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = use(params);
  const { t } = useI18n();
  const artist = MOCK_ARTIST;

  return (
    <div className="min-h-screen bg-bembe-sand">
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
              <button className="p-2 rounded-lg hover:bg-white/10">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${artist.avatar_gradient} flex items-center justify-center text-2xl font-bold`}
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
                {artist.total_plays.toLocaleString()}
              </div>
              <div className="text-xs text-white/50">{t.artist.total_plays}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg">{artist.total_walks}</div>
              <div className="text-xs text-white/50">{t.artist.walks}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="font-bold text-lg flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-bembe-gold fill-bembe-gold" />
                {artist.avg_rating}
              </div>
              <div className="text-xs text-white/50">{t.artist.rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Walks */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="font-bold text-lg mb-4">
          {t.artist.art_walks} ({MOCK_WALKS.length})
        </h2>

        <div className="space-y-3">
          {MOCK_WALKS.map((walk) => (
            <Link
              key={walk.id}
              href={`/walk/${walk.id}`}
              className="block bg-white rounded-xl overflow-hidden shadow-sm border border-bembe-night/5 hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div
                  className={`w-28 h-28 bg-gradient-to-br ${walk.gradient} shrink-0 flex items-center justify-center`}
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

        {/* Support Card */}
        <div className="mt-8 bg-gradient-to-br from-bembe-teal to-emerald-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">
            {t.artist.support} {artist.full_name.split(" ")[0]}
          </h3>
          <p className="text-white/70 text-sm mb-4">
            {t.artist.support_desc}
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-bembe-teal font-medium rounded-xl text-sm hover:bg-white/90 transition-colors">
              {t.artist.send_tip}
            </button>
            <button className="px-4 py-2 bg-white/10 text-white font-medium rounded-xl text-sm hover:bg-white/20 transition-colors">
              {t.artist.gift_walk}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
