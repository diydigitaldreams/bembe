"use client";

import { useState } from "react";
import {
  Headphones,
  DollarSign,
  Users,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

// Date range options
const DATE_RANGES = ["last_7", "last_30", "last_90", "all_time"] as const;
type DateRange = (typeof DATE_RANGES)[number];

// Mock revenue data (last 12 months)
const revenueByMonth = [
  { month: "Apr", value: 180 },
  { month: "May", value: 290 },
  { month: "Jun", value: 420 },
  { month: "Jul", value: 380 },
  { month: "Aug", value: 510 },
  { month: "Sep", value: 470 },
  { month: "Oct", value: 620 },
  { month: "Nov", value: 540 },
  { month: "Dec", value: 710 },
  { month: "Jan", value: 650 },
  { month: "Feb", value: 780 },
  { month: "Mar", value: 840 },
];

const maxRevenue = Math.max(...revenueByMonth.map((r) => r.value));

// Mock top walks
const topWalks = [
  {
    title: "Old San Juan Art Trail",
    plays: 423,
    revenue: "$1,269",
    avgRating: 4.9,
    completionRate: 87,
  },
  {
    title: "Santurce Street Murals",
    plays: 318,
    revenue: "$954",
    avgRating: 4.7,
    completionRate: 82,
  },
  {
    title: "La Placita After Dark",
    plays: 256,
    revenue: "$768",
    avgRating: 4.8,
    completionRate: 79,
  },
  {
    title: "Condado Sculpture Walk",
    plays: 178,
    revenue: "$356",
    avgRating: 4.5,
    completionRate: 91,
  },
  {
    title: "Ponce Heritage Route",
    plays: 72,
    revenue: "$73",
    avgRating: 4.6,
    completionRate: 74,
  },
];

// Mock popular stops
const popularStops = [
  { name: "Mural de la Resistencia", plays: 412, avgListenTime: "3:42" },
  { name: "Plaza de Armas Fountain", plays: 389, avgListenTime: "4:15" },
  { name: "Calle de la Fortaleza", plays: 367, avgListenTime: "2:58" },
  { name: "Museo de Arte de PR", plays: 341, avgListenTime: "5:01" },
  { name: "La Perla Overlook", plays: 298, avgListenTime: "3:27" },
];

// Mock listener locations
const listenerLocations = [
  { location: "San Juan, PR", listeners: 482 },
  { location: "New York, US", listeners: 213 },
  { location: "Miami, US", listeners: 178 },
  { location: "Madrid, Spain", listeners: 94 },
  { location: "Chicago, US", listeners: 67 },
];

const summaryCards = [
  {
    key: "total_plays" as const,
    value: "1,247",
    icon: Headphones,
    color: "bg-bembe-teal/10 text-bembe-teal",
  },
  {
    key: "total_revenue" as const,
    value: "$6,390",
    icon: DollarSign,
    color: "bg-bembe-gold/10 text-bembe-gold",
  },
  {
    key: "unique_listeners" as const,
    value: "834",
    icon: Users,
    color: "bg-bembe-coral/10 text-bembe-coral",
  },
  {
    key: "avg_completion" as const,
    value: "82%",
    icon: CheckCircle,
    color: "bg-bembe-night/10 text-bembe-night",
  },
];

export default function ArtistAnalyticsPage() {
  const { t } = useI18n();
  const [dateRange, setDateRange] = useState<DateRange>("last_30");

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <header className="bg-white border-b border-bembe-night/5">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/artist/dashboard"
                className="p-2 rounded-xl hover:bg-bembe-sand/50 text-bembe-night/40 hover:text-bembe-night transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-bembe-night">
                {t.analytics.title}
              </h1>
            </div>
            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-bembe-sand/50 rounded-xl p-1">
              {DATE_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    dateRange === range
                      ? "bg-white text-bembe-night shadow-sm"
                      : "text-bembe-night/50 hover:text-bembe-night"
                  }`}
                >
                  {t.analytics[range]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.key}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-bembe-night">
                {card.value}
              </p>
              <p className="text-sm text-bembe-night/50 mt-0.5">
                {t.analytics[card.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-bembe-night mb-6">
            {t.analytics.revenue_over_time}
          </h2>
          <div className="flex items-end gap-2 h-48">
            {revenueByMonth.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-bembe-night/40 font-medium">
                  ${item.value}
                </span>
                <div
                  className="w-full bg-bembe-teal/80 rounded-t-lg hover:bg-bembe-teal transition min-h-[4px]"
                  style={{
                    height: `${(item.value / maxRevenue) * 140}px`,
                  }}
                />
                <span className="text-xs text-bembe-night/50">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Walks Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold text-bembe-night mb-4">
              {t.analytics.top_walks}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bembe-night/5">
                  <th className="text-left text-sm font-medium text-bembe-night/50 px-6 py-3">
                    Walk
                  </th>
                  <th className="text-right text-sm font-medium text-bembe-night/50 px-6 py-3">
                    {t.analytics.plays}
                  </th>
                  <th className="text-right text-sm font-medium text-bembe-night/50 px-6 py-3">
                    {t.analytics.revenue}
                  </th>
                  <th className="text-right text-sm font-medium text-bembe-night/50 px-6 py-3">
                    {t.analytics.rating}
                  </th>
                  <th className="text-right text-sm font-medium text-bembe-night/50 px-6 py-3">
                    {t.analytics.completion_rate}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bembe-night/5">
                {topWalks.map((walk) => (
                  <tr
                    key={walk.title}
                    className="hover:bg-bembe-sand/30 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-bembe-teal/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-bembe-teal/50" />
                        </div>
                        <span className="font-medium text-bembe-night">
                          {walk.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-bembe-night">
                      {walk.plays.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-bembe-night">
                      {walk.revenue}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-bembe-night">
                      {walk.avgRating}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bembe-teal/10 text-bembe-teal">
                        {walk.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Stops & Listener Locations side by side */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Stops */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-bembe-night mb-4">
              {t.analytics.popular_stops}
            </h2>
            <div className="space-y-4">
              {popularStops.map((stop, i) => (
                <div
                  key={stop.name}
                  className="flex items-center gap-4"
                >
                  <span className="w-6 h-6 rounded-full bg-bembe-coral/10 text-bembe-coral text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-bembe-night truncate">
                      {stop.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-bembe-night/50">
                      <span>
                        {stop.plays} {t.analytics.plays.toLowerCase()}
                      </span>
                      <span>
                        {t.analytics.avg_listen_time}: {stop.avgListenTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Listener Locations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-bembe-night mb-4">
              {t.analytics.listener_locations}
            </h2>
            <div className="space-y-4">
              {listenerLocations.map((loc, i) => {
                const maxListeners = listenerLocations[0].listeners;
                return (
                  <div key={loc.location} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-bembe-night/30" />
                        <span className="font-medium text-bembe-night text-sm">
                          {loc.location}
                        </span>
                      </div>
                      <span className="text-sm text-bembe-night/50">
                        {loc.listeners} {t.analytics.listeners.toLowerCase()}
                      </span>
                    </div>
                    <div className="w-full bg-bembe-sand rounded-full h-2">
                      <div
                        className="bg-bembe-gold rounded-full h-2 transition-all"
                        style={{
                          width: `${(loc.listeners / maxListeners) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Back to Dashboard link */}
        <div className="text-center pb-4">
          <Link
            href="/artist/dashboard"
            className="text-sm text-bembe-night/50 hover:text-bembe-night transition"
          >
            {t.analytics.back_to_dashboard}
          </Link>
        </div>
      </main>
    </div>
  );
}
