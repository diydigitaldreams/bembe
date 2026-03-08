"use client";

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

// Mock data
const stats = [
  {
    key: "total_plays" as const,
    value: "1,247",
    icon: Headphones,
    color: "bg-bembe-teal/10 text-bembe-teal",
  },
  {
    key: "revenue" as const,
    value: "$3,420",
    icon: DollarSign,
    color: "bg-bembe-gold/10 text-bembe-gold",
  },
  {
    key: "active_walks" as const,
    value: "8",
    icon: MapPin,
    color: "bg-bembe-coral/10 text-bembe-coral",
  },
  {
    key: "avg_rating" as const,
    value: "4.8",
    icon: Star,
    color: "bg-bembe-night/10 text-bembe-night",
  },
];

const walks = [
  {
    id: "1",
    title: "Old San Juan Art Trail",
    plays: 423,
    revenue: "$1,269",
    status: "published" as const,
    neighborhood: "Viejo San Juan",
  },
  {
    id: "2",
    title: "Santurce Street Murals",
    plays: 318,
    revenue: "$954",
    status: "published" as const,
    neighborhood: "Santurce",
  },
  {
    id: "3",
    title: "La Placita After Dark",
    plays: 256,
    revenue: "$768",
    status: "published" as const,
    neighborhood: "Santurce",
  },
  {
    id: "4",
    title: "Condado Sculpture Walk",
    plays: 178,
    revenue: "$356",
    status: "published" as const,
    neighborhood: "Condado",
  },
  {
    id: "5",
    title: "Ponce Heritage Route",
    plays: 72,
    revenue: "$73",
    status: "published" as const,
    neighborhood: "Ponce",
  },
  {
    id: "6",
    title: "Rincon Surf & Art",
    plays: 0,
    revenue: "$0",
    status: "draft" as const,
    neighborhood: "Rincon",
  },
];

export default function ArtistDashboardPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <header className="bg-white border-b border-bembe-night/5">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-bembe-night/50">{t.dashboard.welcome}</p>
              <h1 className="text-2xl font-bold text-bembe-night">
                Maria del Carmen
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
                AI-Powered
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{t.dashboard.ai_grant_title}</h3>
            <p className="text-white/60 text-sm mb-4 max-w-md">
              {t.dashboard.ai_grant_desc}
            </p>
            <button className="px-5 py-2.5 rounded-xl bg-bembe-gold text-bembe-night font-semibold hover:bg-bembe-gold/90 active:scale-[0.98] transition text-sm">
              {t.dashboard.ai_grant_cta}
            </button>
          </div>
        </div>

        {/* Walks List */}
        <div>
          <h2 className="text-lg font-semibold text-bembe-night mb-4">
            {t.dashboard.my_walks}
          </h2>
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
                        walk.status === "published"
                          ? "bg-bembe-teal/10 text-bembe-teal"
                          : "bg-bembe-night/10 text-bembe-night/50"
                      }`}
                    >
                      {walk.status === "published" ? t.dashboard.published : t.dashboard.draft}
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
                      {walk.plays}
                    </p>
                    <p className="text-bembe-night/40 text-xs">{t.dashboard.plays}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-bembe-night">
                      {walk.revenue}
                    </p>
                    <p className="text-bembe-night/40 text-xs">{t.dashboard.revenue}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-bembe-sand/50 text-bembe-night/40 hover:text-bembe-night transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-bembe-sand/50 text-bembe-night/40 hover:text-bembe-night transition">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
