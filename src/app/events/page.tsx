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
}

const MOCK_EVENTS: MockEvent[] = [
  {
    id: "1",
    title: "Noche de Bomba y Plena en Loiza",
    description:
      "Una noche de tradicion afro-boricua con musicos y bailarines locales. Incluye recorrido de arte por las calles de Loiza.",
    location_name: "Plaza de Loiza",
    date: "March 22, 2026",
    time: "7:00 PM",
    price: 25,
    max_capacity: 150,
    tickets_sold: 89,
    organizer: "Colectivo Loiza Viva",
    neighborhood: "Loiza",
    gradient: "from-bembe-coral to-orange-400",
  },
  {
    id: "2",
    title: "Santurce Art Walk: After Dark",
    description:
      "Guided night walk through Santurce's most iconic murals. Local artists share the stories behind their work. Drinks included.",
    location_name: "Calle Cerra, Santurce",
    date: "March 28, 2026",
    time: "8:00 PM",
    price: 35,
    max_capacity: 40,
    tickets_sold: 32,
    organizer: "Santurce es Ley",
    neighborhood: "Santurce",
    gradient: "from-bembe-teal to-emerald-400",
  },
  {
    id: "3",
    title: "Taller de Ceramica Taina",
    description:
      "Workshop de ceramica inspirada en los Tainos, dirigido por la artesana Maria del Carmen. Materiales incluidos.",
    location_name: "Centro de Bellas Artes, Ponce",
    date: "April 5, 2026",
    time: "10:00 AM",
    price: 45,
    max_capacity: 20,
    tickets_sold: 14,
    organizer: "Maria del Carmen Ruiz",
    neighborhood: "Ponce",
    gradient: "from-bembe-gold to-yellow-400",
  },
  {
    id: "4",
    title: "Sunset Sounds: Live Music at La Perla",
    description:
      "Intimate acoustic session overlooking the ocean. Three local musicians perform original compositions inspired by Old San Juan.",
    location_name: "La Perla Viewpoint",
    date: "April 12, 2026",
    time: "5:30 PM",
    price: 0,
    max_capacity: 80,
    tickets_sold: 67,
    organizer: "Bembe Community",
    neighborhood: "Old San Juan",
    gradient: "from-purple-500 to-bembe-coral",
  },
  {
    id: "5",
    title: "Mercado de Arte: Rincon Edition",
    description:
      "Pop-up art market featuring 30+ local artists. Paintings, sculptures, jewelry, and prints. Live music and local food.",
    location_name: "Plaza de Rincon",
    date: "April 19, 2026",
    time: "11:00 AM",
    price: 0,
    max_capacity: 500,
    tickets_sold: 203,
    organizer: "Rincon Art Collective",
    neighborhood: "Rincon",
    gradient: "from-bembe-teal to-blue-400",
  },
];

export default function EventsPage() {
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
            <h1 className="text-xl font-bold">Events</h1>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bembe-night/40" />
            <input
              type="text"
              placeholder="Search events..."
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
                {n === "all" ? "All Events" : n}
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
                    FREE
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
                  by {event.organizer}
                </span>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-bembe-teal text-white rounded-xl text-sm font-medium hover:bg-bembe-teal/90 transition-colors">
                  <Ticket className="w-4 h-4" />
                  {event.price === 0
                    ? "RSVP Free"
                    : `$${event.price} — Get Ticket`}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-bembe-night/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No events found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
