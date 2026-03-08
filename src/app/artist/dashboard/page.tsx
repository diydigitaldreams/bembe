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
} from "lucide-react";
import Link from "next/link";

// Mock data
const stats = [
  {
    label: "Total Plays",
    value: "1,247",
    icon: Headphones,
    color: "bg-bembe-teal/10 text-bembe-teal",
  },
  {
    label: "Revenue This Month",
    value: "$3,420",
    icon: DollarSign,
    color: "bg-bembe-gold/10 text-bembe-gold",
  },
  {
    label: "Active Walks",
    value: "8",
    icon: MapPin,
    color: "bg-bembe-coral/10 text-bembe-coral",
  },
  {
    label: "Avg Rating",
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
  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <header className="bg-white border-b border-bembe-night/5">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-bembe-night/50">Welcome back</p>
              <h1 className="text-2xl font-bold text-bembe-night">
                Maria del Carmen
              </h1>
            </div>
            <Link
              href="/artist/walks/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition shadow-lg shadow-bembe-teal/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create New Walk</span>
              <span className="sm:hidden">New Walk</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
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
                {stat.label}
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
            <h3 className="text-xl font-bold mb-1">Grant Assistant</h3>
            <p className="text-white/60 text-sm mb-4 max-w-md">
              Find and apply for arts grants automatically. Our AI matches your
              profile with available funding from NEA, local foundations, and
              Act 60 programs.
            </p>
            <button className="px-5 py-2.5 rounded-xl bg-bembe-gold text-bembe-night font-semibold hover:bg-bembe-gold/90 active:scale-[0.98] transition text-sm">
              Explore Grants
            </button>
          </div>
        </div>

        {/* Walks List */}
        <div>
          <h2 className="text-lg font-semibold text-bembe-night mb-4">
            Your Walks
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
                      {walk.status}
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
                    <p className="text-bembe-night/40 text-xs">plays</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-bembe-night">
                      {walk.revenue}
                    </p>
                    <p className="text-bembe-night/40 text-xs">revenue</p>
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
