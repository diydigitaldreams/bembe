"use client";

import { useState, useEffect } from "react";
import {
  Headphones,
  DollarSign,
  MapPin,
  Star,
  Plus,
  Sparkles,
  Eye,
  MoreVertical,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SkeletonList } from "@/components/skeleton";
import { createClient } from "@/lib/supabase/client";
import StripeConnectBanner from "@/components/stripe-connect-banner";
import type { ArtWalk } from "@/types";

export default function ArtistDashboardPage() {
  const { t } = useI18n();
  const [userName, setUserName] = useState("");
  const [walks, setWalks] = useState<ArtWalk[]>([]);
  const [revenueCents, setRevenueCents] = useState(0);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login (full page nav since we're outside router context)
        window.location.replace("/login");
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, stripe_account_id")
        .eq("id", user.id)
        .single();

      setUserName(profile?.full_name || user.email || "");
      setStripeAccountId(profile?.stripe_account_id || null);

      // Fetch artist's walks (published + drafts)
      const { data: walksData } = await supabase
        .from("art_walks")
        .select("*")
        .eq("artist_id", user.id)
        .order("created_at", { ascending: false });

      const artistWalks = walksData || [];
      setWalks(artistWalks);

      // Fetch revenue from walk purchases for this artist's walks
      if (artistWalks.length > 0) {
        const walkIds = artistWalks.map((w) => w.id);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { data: purchases } = await supabase
          .from("walk_purchases")
          .select("amount_cents")
          .in("walk_id", walkIds)
          .gte("created_at", monthStart);

        const revenueCents = (purchases || []).reduce(
          (sum, p) => sum + (p.amount_cents || 0),
          0
        );
        setRevenueCents(revenueCents);
      }

      setLoading(false);
    }
    fetchDashboard();
  }, []);

  const totalPlays = walks.reduce((sum, w) => sum + w.total_plays, 0);
  const activeCount = walks.filter((w) => w.is_published).length;
  const avgRating = walks.length > 0
    ? (walks.reduce((sum, w) => sum + Number(w.avg_rating), 0) / walks.length).toFixed(1)
    : "0";

  const stats = [
    {
      key: "total_plays" as const,
      value: totalPlays.toLocaleString(),
      icon: Headphones,
      color: "bg-bembe-teal/10 text-bembe-teal",
    },
    {
      key: "revenue" as const,
      value: `$${(revenueCents / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-bembe-gold/10 text-bembe-gold",
    },
    {
      key: "active_walks" as const,
      value: String(activeCount),
      icon: MapPin,
      color: "bg-bembe-coral/10 text-bembe-coral",
    },
    {
      key: "avg_rating" as const,
      value: avgRating,
      icon: Star,
      color: "bg-bembe-night/10 text-bembe-night",
    },
  ];
  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <header className="bg-white border-b border-bembe-night/5">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-bembe-night/50">{t.dashboard.welcome}</p>
              <h1 className="text-2xl font-bold text-bembe-night">
                {userName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/artist/analytics"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bembe-night/10 text-bembe-night font-semibold hover:bg-bembe-night/20 active:scale-[0.98] transition"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{t.analytics.view_analytics}</span>
              </Link>
              <Link
                href="/artist/walks/new"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition shadow-lg shadow-bembe-teal/20"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.dashboard.create_walk}</span>
                <span className="sm:hidden">{t.dashboard.create_walk}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Stripe Connect Banner */}
        <StripeConnectBanner stripeAccountId={stripeAccountId} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-bembe-night">
                {stat.value}
              </p>
              <p className="text-sm text-bembe-night/50 mt-0.5">
                {t.dashboard[stat.key]}
              </p>
            </div>
          ))}
        </div>

        {/* AI Grant Assistant CTA */}
        <div className="bg-gradient-to-br from-bembe-night to-bembe-night/90 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-bembe-gold/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-bembe-gold" />
              <span className="text-sm font-medium text-bembe-gold">
                {t.dashboard.ai_grant_title}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{t.dashboard.ai_grant_title}</h3>
            <p className="text-white/60 text-sm mb-4 max-w-md">
              {t.dashboard.ai_grant_desc}
            </p>
            <Link
              href="/grants"
              className="inline-block px-5 py-2.5 rounded-xl bg-bembe-gold text-bembe-night font-semibold hover:bg-bembe-gold/90 active:scale-[0.98] transition text-sm"
            >
              {t.dashboard.ai_grant_cta}
            </Link>
          </div>
        </div>

        {/* Walks List */}
        <div>
          <h2 className="text-lg font-semibold text-bembe-night mb-4">
            {t.dashboard.my_walks}
          </h2>
          {loading ? (
            <SkeletonList count={3} />
          ) : walks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <MapPin className="w-10 h-10 text-bembe-night/20 mx-auto mb-3" />
              <p className="text-bembe-night/50">{t.dashboard.no_walks}</p>
              <Link
                href="/artist/walks/new"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                {t.dashboard.create_walk}
              </Link>
            </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-bembe-night/5 overflow-hidden">
            {walks.map((walk) => (
              <div
                key={walk.id}
                className="flex items-center gap-4 p-4 hover:bg-bembe-sand/30 transition"
              >
                {/* Thumbnail placeholder */}
                <div className="w-14 h-14 rounded-xl bg-bembe-teal/10 flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-bembe-teal/50" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-bembe-night truncate">
                      {walk.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        walk.is_published
                          ? "bg-bembe-teal/10 text-bembe-teal"
                          : "bg-bembe-night/10 text-bembe-night/50"
                      }`}
                    >
                      {walk.is_published ? t.dashboard.published : t.dashboard.draft}
                    </span>
                  </div>
                  <p className="text-sm text-bembe-night/50">
                    {walk.neighborhood}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-semibold text-bembe-night">
                      {walk.total_plays}
                    </p>
                    <p className="text-bembe-night/40 text-xs">{t.dashboard.plays}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/walk/${walk.id}`}
                    className="p-2 rounded-lg hover:bg-bembe-sand/50 text-bembe-night/40 hover:text-bembe-night transition"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/artist/walks/new`}
                    className="p-2 rounded-lg hover:bg-bembe-sand/50 text-bembe-night/40 hover:text-bembe-night transition"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
