"use client";

import { use } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Navigation,
  Star,
  MapPin,
  Play,
  User,
  Route,
} from "lucide-react";
import type { ArtWalk, WalkStop, Profile } from "@/types";
import GiftButton from "@/components/gift-button";
import { useI18n } from "@/lib/i18n/context";

const MOCK_ARTIST: Profile = {
  id: "artist-1",
  email: "marina@bembe.art",
  full_name: "Marina Del Valle",
  avatar_url: null,
  role: "artist",
  bio: "Visual artist and urban storyteller born and raised in Santurce. Marina has spent 15 years documenting the street art renaissance that transformed her neighborhood into one of the Caribbean's most vibrant art districts.",
  location: "Santurce, San Juan",
  lat: 18.4468,
  lng: -66.0614,
  is_act60: false,
  stripe_account_id: null,
  stripe_customer_id: null,
  created_at: "2025-01-01",
};

const MOCK_STOPS: WalkStop[] = [
  {
    id: "stop-1",
    walk_id: "walk-santurce",
    order_index: 0,
    title: "Calle Cerra: The Birth of a Movement",
    description:
      "Start at the intersection where Santurce's street art revolution began. Learn about the first murals that appeared in 2010 and the artists who dared to transform blank walls into canvases.",
    audio_url: null,
    image_urls: [],
    lat: 18.4455,
    lng: -66.0625,
    trigger_radius_meters: 30,
    duration_seconds: 180,
  },
  {
    id: "stop-2",
    walk_id: "walk-santurce",
    order_index: 1,
    title: "MAC: Museo de Arte Contemporaneo",
    description:
      "The anchor of Santurce's art scene. Discover how this museum became a catalyst for the surrounding neighborhood's creative explosion.",
    audio_url: null,
    image_urls: [],
    lat: 18.4470,
    lng: -66.0590,
    trigger_radius_meters: 40,
    duration_seconds: 240,
  },
  {
    id: "stop-3",
    walk_id: "walk-santurce",
    order_index: 2,
    title: "La Placita: Where Art Meets Life",
    description:
      "By day, a farmers' market; by night, the island's most iconic gathering spot. Hear stories of the vendors, musicians, and artists who make La Placita the soul of Santurce.",
    audio_url: null,
    image_urls: [],
    lat: 18.4452,
    lng: -66.0605,
    trigger_radius_meters: 35,
    duration_seconds: 210,
  },
  {
    id: "stop-4",
    walk_id: "walk-santurce",
    order_index: 3,
    title: "Tras Talleres: The Hidden Studios",
    description:
      "Venture behind the main streets to discover working artist studios. Peek into the creative process and learn about the community that sustains itself through art.",
    audio_url: null,
    image_urls: [],
    lat: 18.4480,
    lng: -66.0570,
    trigger_radius_meters: 30,
    duration_seconds: 200,
  },
  {
    id: "stop-5",
    walk_id: "walk-santurce",
    order_index: 4,
    title: "Miramar: Art Deco to Neo-Muralism",
    description:
      "End your walk where old meets new. The Art Deco buildings of Miramar serve as backdrop for a new generation of muralists redefining Puerto Rican identity.",
    audio_url: null,
    image_urls: [],
    lat: 18.4500,
    lng: -66.0650,
    trigger_radius_meters: 35,
    duration_seconds: 220,
  },
];

const MOCK_WALK: ArtWalk = {
  id: "walk-santurce",
  artist_id: "artist-1",
  title: "Santurce Es Ley",
  description:
    "Explore the vibrant street art and galleries of Santurce, Puerto Rico's creative heartbeat. From towering murals on Calle Cerra to the hidden studios of Tras Talleres, this walk takes you through the neighborhood that sparked an island-wide art renaissance. You'll hear stories from the artists themselves, learn the history behind iconic works, and discover why Santurce has become a pilgrimage site for art lovers from around the world.",
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
  artist: MOCK_ARTIST,
  stops: MOCK_STOPS,
};

export default function WalkDetailPage({
  params,
}: {
  params: Promise<{ walkId: string }>;
}) {
  const { walkId } = use(params);
  const { t } = useI18n();
  // In production, fetch walk by walkId. Using mock data for now.
  const walk = MOCK_WALK;
  const stops = walk.stops ?? [];
  const artist = walk.artist!;
  const totalStopDuration = stops.reduce((sum, s) => sum + s.duration_seconds, 0);

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
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />

        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
          <Link
            href="/map"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </div>

        {/* Hero content */}
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
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bembe-teal text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < stops.length - 1 && (
                    <div className="w-0.5 flex-1 bg-bembe-teal/20 my-1" />
                  )}
                </div>
                {/* Content */}
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

        {/* Reviews placeholder */}
        <div className="mb-32">
          <h2 className="text-lg font-bold text-bembe-night mb-3">{t.walk.reviews}</h2>
          <div className="bg-white rounded-2xl p-6 text-center">
            <Star className="h-8 w-8 text-bembe-gold/30 mx-auto mb-2" />
            <p className="text-sm text-bembe-night/50">
              {walk.total_plays} {t.walk.people_taken}
            </p>
            <p className="text-sm text-bembe-night/50 mt-1">
              {t.walk.coming_soon}
            </p>
          </div>
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
          <Link
            href={`/walk/${walk.id}/play`}
            className="flex items-center gap-2 h-14 px-8 rounded-2xl bg-bembe-teal text-white font-semibold transition-all hover:bg-bembe-teal/90 active:scale-[0.98]"
          >
            <Play className="h-5 w-5 fill-white" />
            {walk.price_cents === 0 ? t.walk.start : t.walk.purchase}
          </Link>
        </div>
      </div>
    </div>
  );
}
