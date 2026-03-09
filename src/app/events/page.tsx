"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  ChevronLeft,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface MockEvent {
  id: string;
  title: string;
  description: string;
  location_name: string;
  date: string;
  time: string;
  price: number;
  max_capacity: number;
  tickets_sold: number;
  organizer: string;
  neighborhood: string;
  gradient: string;
  rsvp_url: string;
}

const MOCK_EVENTS: MockEvent[] = [
  {
    id: "1",
    title: "Noche de Bomba y Plena en Loiza",
    description:
      "Una noche de tradicion afro-boricua con musicos y bailarines locales. Incluye recorrido de arte por las calles de Loiza.",
    location_name: "Plaza de Loiza",
    date: "22 de marzo, 2026",
    time: "7:00 PM",
    price: 25,
    max_capacity: 150,
    tickets_sold: 89,
    organizer: "Colectivo Loiza Viva",
    neighborhood: "Loiza",
    gradient: "from-bembe-coral to-orange-400",
    rsvp_url: "https://forms.gle/bembe-bomba-loiza",
  },
  {
    id: "2",
    title: "Caminata Nocturna por los Murales de Santurce",
    description:
      "Recorrido nocturno guiado por los murales mas iconicos de Santurce. Artistas locales comparten las historias detras de sus obras. Bebidas incluidas.",
    location_name: "Calle Cerra, Santurce",
    date: "28 de marzo, 2026",
    time: "8:00 PM",
    price: 35,
    max_capacity: 40,
    tickets_sold: 32,
    organizer: "Santurce es Ley",
    neighborhood: "Santurce",
    gradient: "from-bembe-teal to-emerald-400",
    rsvp_url: "https://forms.gle/bembe-santurce-night",
  },
  {
    id: "3",
    title: "Taller de Ceramica Taina",
    description:
      "Taller de ceramica inspirada en los Tainos, dirigido por la artesana Maria del Carmen. Materiales incluidos.",
    location_name: "Centro de Bellas Artes, Ponce",
    date: "5 de abril, 2026",
    time: "10:00 AM",
    price: 45,
    max_capacity: 20,
    tickets_sold: 14,
    organizer: "Maria del Carmen Ruiz",
    neighborhood: "Ponce",
    gradient: "from-bembe-gold to-yellow-400",
    rsvp_url: "https://forms.gle/bembe-ceramica-ponce",
  },
  {
    id: "4",
    title: "Sonidos del Atardecer: Musica en Vivo en La Perla",
    description:
      "Sesion acustica intima con vista al oceano. Tres musicos locales interpretan composiciones originales inspiradas en el Viejo San Juan.",
    location_name: "Mirador de La Perla",
    date: "12 de abril, 2026",
    time: "5:30 PM",
    price: 0,
    max_capacity: 80,
    tickets_sold: 67,
    organizer: "Bembe Community",
    neighborhood: "Viejo San Juan",
    gradient: "from-purple-500 to-bembe-coral",
    rsvp_url: "https://forms.gle/bembe-sunset-perla",
  },
  {
    id: "5",
    title: "Mercado de Arte: Edicion Rincon",
    description:
      "Mercado de arte pop-up con mas de 30 artistas locales. Pinturas, esculturas, joyeria e impresiones. Musica en vivo y comida local.",
    location_name: "Plaza de Rincon",
    date: "19 de abril, 2026",
    time: "11:00 AM",
    price: 0,
    max_capacity: 500,
    tickets_sold: 203,
    organizer: "Colectivo de Arte Rincon",
    neighborhood: "Rincon",
    gradient: "from-bembe-teal to-blue-400",
    rsvp_url: "https://forms.gle/bembe-mercado-rincon",
  },
];

export default function EventsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const neighborhoods = [
    "all",
    ...new Set(MOCK_EVENTS.map((e) => e.neighborhood)),
  ];

  const filtered = MOCK_EVENTS.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || e.neighborhood === filter;
    return matchesSearch && matchesFilter;
  });

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
        {filtered.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-bembe-night/5 hover:shadow-md transition-shadow"
          >
            {/* Color Banner */}
            <div
              className={`h-32 bg-gradient-to-br ${event.gradient} relative`}
            >
              <div className="absolute bottom-3 left-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3" />
                  {event.neighborhood}
                </span>
              </div>
              {event.price === 0 && (
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
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {event.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {event.tickets_sold}/{event.max_capacity}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-bembe-night/40">
                  {t.events.by} {event.organizer}
                </span>
                <a
                  href={event.rsvp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-bembe-teal text-white rounded-xl text-sm font-medium hover:bg-bembe-teal/90 transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  {event.price === 0
                    ? t.events.rsvp_free
                    : `$${event.price} — ${t.events.get_ticket}`}
                </a>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-bembe-night/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t.events.empty_title}</p>
            <p className="text-sm mt-1">{t.events.empty_subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
