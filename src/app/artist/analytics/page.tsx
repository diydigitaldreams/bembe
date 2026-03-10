"use client";

import { useState, useEffect } from "react";
import {
  Headphones,
  DollarSign,
  Users,
  CheckCircle,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SkeletonCard } from "@/components/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { ArtWalk } from "@/types";

// Date range options
const DATE_RANGES = ["last_7", "last_30", "last_90", "all_time"] as const;
type DateRange = (typeof DATE_RANGES)[number];

interface WalkWithRevenue {
  id: string;
  title: string;
  plays: number;
  revenue: number;
  avgRating: number;
}

interface MonthlyRevenue {
  month: string;
  value: number;
}

function getDateRangeStart(range: DateRange): string | null {
  if (range === "all_time") return null;
  const now = new Date();
  const days = range === "last_7" ? 7 : range === "last_30" ? 30 : 90;
  now.setDate(now.getDate() - days);
  return now.toISOString();
}

export default function ArtistAnalyticsPage() {
  const { t } = useI18n();
  const [dateRange, setDateRange] = useState<DateRange>("last_30");
  const [loading, setLoading] = useState(true);
  const [walks, setWalks] = useState<ArtWalk[]>([]);
  const [topWalks, setTopWalks] = useState<WalkWithRevenue[]>([]);
  const [revenueByMonth, setRevenueByMonth] = useState<MonthlyRevenue[]>([]);
  const [totalRevenueCents, setTotalRevenueCents] = useState(0);
  const [uniqueBuyers, setUniqueBuyers] = useState(0);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.replace("/login");
        return;
      }

      // Fetch artist's walks
      const { data: walksData } = await supabase
        .from("art_walks")
        .select("*")
        .eq("artist_id", user.id)
        .order("total_plays", { ascending: false });

      const artistWalks = walksData || [];
      setWalks(artistWalks);

      if (artistWalks.length === 0) {
        setLoading(false);
        return;
      }

      const walkIds = artistWalks.map((w) => w.id);
      const rangeStart = getDateRangeStart(dateRange);

      // Fetch purchases in date range
      let purchaseQuery = supabase
        .from("walk_purchases")
        .select("walk_id, amount_cents, user_id, created_at")
        .in("walk_id", walkIds);

      if (rangeStart) {
        purchaseQuery = purchaseQuery.gte("created_at", rangeStart);
      }

      const { data: purchases } = await purchaseQuery;
      const purchaseList = purchases || [];

      // Total revenue
      const totalCents = purchaseList.reduce(
        (sum, p) => sum + (p.amount_cents || 0),
        0
      );
      setTotalRevenueCents(totalCents);

      // Unique buyers
      const buyers = new Set(purchaseList.map((p) => p.user_id));
      setUniqueBuyers(buyers.size);

      // Revenue per walk
      const revenueMap = new Map<string, number>();
      for (const p of purchaseList) {
        revenueMap.set(
          p.walk_id,
          (revenueMap.get(p.walk_id) || 0) + (p.amount_cents || 0)
        );
      }

      const walkRevenues: WalkWithRevenue[] = artistWalks
        .map((w) => ({
          id: w.id,
          title: w.title,
          plays: w.total_plays,
          revenue: revenueMap.get(w.id) || 0,
          avgRating: Number(w.avg_rating) || 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopWalks(walkRevenues);

      // Revenue by month (last 6 months)
      const monthlyMap = new Map<string, number>();
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      // Initialize last 6 months
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap.set(key, 0);
      }

      // Fill with all purchases (not filtered by date range)
      const { data: allPurchases } = await supabase
        .from("walk_purchases")
        .select("amount_cents, created_at")
        .in("walk_id", walkIds);

      for (const p of allPurchases || []) {
        const d = new Date(p.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyMap.has(key)) {
          monthlyMap.set(key, (monthlyMap.get(key) || 0) + (p.amount_cents || 0));
        }
      }

      const monthly: MonthlyRevenue[] = [];
      for (const [key, value] of monthlyMap.entries()) {
        const [, m] = key.split("-");
        monthly.push({ month: monthNames[parseInt(m, 10) - 1], value: value / 100 });
      }
      setRevenueByMonth(monthly);

      setLoading(false);
    }
    fetchAnalytics();
  }, [dateRange]);

  const totalPlays = walks.reduce((sum, w) => sum + w.total_plays, 0);
  const avgCompletion = walks.length > 0
    ? Math.round(
        walks.reduce((sum, w) => sum + Number(w.avg_rating || 0), 0) /
          walks.length *
          20
      )
    : 0;

  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.value), 1);

  const summaryCards = [
    {
      key: "total_plays" as const,
      value: totalPlays.toLocaleString(),
      icon: Headphones,
      color: "bg-bembe-teal/10 text-bembe-teal",
    },
    {
      key: "total_revenue" as const,
      value: `$${(totalRevenueCents / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-bembe-gold/10 text-bembe-gold",
    },
    {
      key: "unique_listeners" as const,
      value: String(uniqueBuyers),
      icon: Users,
      color: "bg-bembe-coral/10 text-bembe-coral",
    },
    {
      key: "avg_completion" as const,
      value: `${avgCompletion}%`,
      icon: CheckCircle,
      color: "bg-bembe-night/10 text-bembe-night",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bembe-sand">
        <header className="bg-white border-b border-bembe-night/5">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="h-8 bg-bembe-night/10 rounded w-48 animate-pulse" />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-bembe-night/10 rounded w-40 mb-6" />
            <div className="h-48 bg-bembe-night/5 rounded" />
          </div>
        </main>
      </div>
    );
  }

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
          {revenueByMonth.length > 0 ? (
            <div className="flex items-end gap-2 h-48">
              {revenueByMonth.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-bembe-night/40 font-medium">
                    ${item.value.toFixed(0)}
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
          ) : (
            <p className="text-bembe-night/40 text-center py-8">
              {"—"}
            </p>
          )}
        </div>

        {/* Top Walks Table */}
        {topWalks.length > 0 && (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-bembe-night/5">
                  {topWalks.map((walk) => (
                    <tr
                      key={walk.id}
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
                        ${(walk.revenue / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-bembe-night">
                        {walk.avgRating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
