"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  ChevronLeft,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SkeletonCard } from "@/components/skeleton";
import type { Event } from "@/types";

const GRADIENTS = [
  "from-bembe-coral to-orange-400",
  "from-bembe-teal to-emerald-400",
  "from-bembe-gold to-yellow-400",
  "from-purple-500 to-bembe-coral",
  "from-bembe-teal to-blue-400",
];

export default function EventsPage() {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/events?page=1&limit=${PAGE_SIZE}`);
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setCurrentPage(1);
        }
      } catch {
        // API failed
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  async function loadMore() {
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/events?page=${nextPage}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        setEvents((prev) => [...prev, ...data.events]);
      }
      if (data.pagination) {
        setTotalPages(data.pagination.total_pages);
      }
      setCurrentPage(nextPage);
    } catch {
      // Failed to load more
    } finally {
      setLoadingMore(false);
    }
  }

  const neighborhoods = useMemo(
    () => ["all", ...new Set(events.map((e) => e.neighborhood).filter(Boolean))],
    [events]
  );

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" || e.neighborhood === filter;
      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bembe-sand/95 backdrop-blur-sm border-b border-bembe-night/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg hover:bg-bembe-night/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">{t.events.title}</h1>
            <Link
              href="/artist/events/new"
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-bembe-teal text-white rounded-xl text-sm font-medium hover:bg-bembe-teal/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.events.create_event}</span>
            </Link>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/40" />
            <input
              type="text"
              placeholder={t.events.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-bembe-night/10 text-sm focus:outline-none focus:ring-2 focus:ring-bembe-teal/30"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {neighborhoods.map((n) => (
              <button
                key={n}
                onClick={() => setFilter(n)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === n
                    ? "bg-bembe-teal text-white"
                    : "bg-white text-bembe-night/60 border border-bembe-night/10"
                }`}
              >
                {n === "all" ? t.events.all_events : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((event, idx) => {
            const priceDollars = event.ticket_price_cents / 100;
            const gradient = GRADIENTS[idx % GRADIENTS.length];
            const startDate = new Date(event.starts_at);
            const dateStr = startDate.toLocaleDateString(locale === "es" ? "es-PR" : "en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const timeStr = startDate.toLocaleTimeString(locale === "es" ? "es-PR" : "en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-bembe-night/5 hover:shadow-md transition-shadow"
              >
                {/* Color Banner */}
                <div
                  className={`h-32 bg-gradient-to-br ${gradient} relative`}
                >
                  <div className="absolute bottom-3 left-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3" />
                      {event.neighborhood}
                    </span>
                  </div>
                  {event.ticket_price_cents === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                        {t.discover.free.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-bembe-night/60 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-bembe-night/50 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {timeStr}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.tickets_sold}/{event.max_capacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-bembe-night/40">
                      {t.events.by} {event.organizer?.full_name || ""}
                    </span>
                    {event.rsvp_url ? (
                      <a
                        href={event.rsvp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-bembe-teal text-white rounded-xl text-sm font-medium hover:bg-bembe-teal/90 transition-colors"
                      >
                        <Ticket className="w-4 h-4" />
                        {event.ticket_price_cents === 0
                          ? t.events.rsvp_free
                          : `$${priceDollars} — ${t.events.get_ticket}`}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-bembe-teal/20 text-bembe-teal rounded-xl text-sm font-medium">
                        <Ticket className="w-4 h-4" />
                        {event.ticket_price_cents === 0
                          ? t.events.rsvp_free
                          : `$${priceDollars}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bembe-teal/10">
              <Calendar className="h-8 w-8 text-bembe-teal" />
            </div>
            <p className="font-medium text-bembe-night/70">{t.events.no_events_title}</p>
            <p className="text-sm mt-1 text-bembe-night/40">{t.events.no_events_subtitle}</p>
            <Link
              href="/artist/events/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-bembe-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90"
            >
              {t.events.empty_cta}
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 text-bembe-night/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t.events.empty_title}</p>
            <p className="text-sm mt-1">{t.events.empty_subtitle}</p>
          </div>
        )}
        {!loading && filtered.length > 0 && currentPage < totalPages && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-xl bg-bembe-teal px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90 disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.events.loading_more}
                </>
              ) : (
                t.events.load_more
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
