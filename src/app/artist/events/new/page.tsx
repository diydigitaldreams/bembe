"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Link as LinkIcon,
  Loader2,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { DEFAULT_COORDINATES } from "@/lib/constants";

const NEIGHBORHOODS = [
  "Viejo San Juan", "Santurce", "Condado", "Ocean Park", "Isla Verde",
  "Miramar", "Hato Rey", "Rio Piedras", "Caguas", "Ponce",
  "Mayaguez", "Rincon", "Cabo Rojo", "Vieques", "Culebra",
  "Loiza", "Fajardo", "Humacao", "Aguadilla", "Arecibo",
];

export default function CreateEventPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [pricingType, setPricingType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPublish =
    title.trim() &&
    locationName.trim() &&
    neighborhood &&
    startsAt &&
    endsAt &&
    new Date(endsAt) > new Date(startsAt);

  async function handleSubmit(publish: boolean) {
    setPublishing(true);
    setError(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location_name: locationName.trim(),
          neighborhood,
          lat: DEFAULT_COORDINATES.lat,
          lng: DEFAULT_COORDINATES.lng,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: new Date(endsAt).toISOString(),
          ticket_price_cents: pricingType === "paid" ? Math.round(parseFloat(price || "0") * 100) : 0,
          max_capacity: parseInt(maxCapacity || "0"),
          rsvp_url: rsvpUrl.trim(),
          is_published: publish,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setPublishing(false);
        return;
      }

      router.push("/events");
    } catch {
      setError("Failed to create event");
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bembe-sand/95 backdrop-blur-sm border-b border-bembe-night/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/artist/dashboard"
            className="p-2 -ml-2 rounded-lg hover:bg-bembe-night/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">{t.events.create_title}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-bembe-coral/10 text-bembe-coral text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
              {t.events.event_title}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.events.event_title_placeholder}
              className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
              {t.events.event_description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.events.event_description_placeholder}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition resize-none"
            />
          </div>

          {/* Location + Neighborhood */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                {t.events.event_location}
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder={t.events.event_location_placeholder}
                className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                {t.events.event_neighborhood}
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
              >
                <option value="">—</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date/Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {t.events.event_date}
              </label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
                {t.events.event_end_date}
              </label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                min={startsAt}
                className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              {t.events.event_capacity}
            </label>
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder={t.events.event_capacity_placeholder}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
            />
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-bembe-night/70 mb-2">
              <DollarSign className="w-3.5 h-3.5 inline mr-1" />
              {t.events.event_pricing}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {(["free", "paid"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPricingType(type)}
                  className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition ${
                    pricingType === type
                      ? "border-bembe-teal bg-bembe-teal/5 text-bembe-teal"
                      : "border-bembe-night/10 text-bembe-night/60 hover:border-bembe-night/20"
                  }`}
                >
                  {pricingType === type && (
                    <Check className="w-3.5 h-3.5 inline mr-1" />
                  )}
                  {type === "free" ? t.events.event_free : t.events.event_paid}
                </button>
              ))}
            </div>

            {pricingType === "paid" && (
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t.events.event_price}
                min="1"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
              />
            )}
          </div>

          {/* RSVP Link */}
          <div>
            <label className="block text-sm font-medium text-bembe-night/70 mb-1.5">
              <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
              {t.events.event_rsvp_url}
            </label>
            <input
              type="url"
              value={rsvpUrl}
              onChange={(e) => setRsvpUrl(e.target.value)}
              placeholder={t.events.event_rsvp_placeholder}
              className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-white text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleSubmit(false)}
              disabled={publishing || !title.trim()}
              className="flex-1 py-3 rounded-xl border-2 border-bembe-night/10 text-bembe-night/70 font-semibold text-sm hover:bg-bembe-night/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.events.event_save_draft}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={publishing || !canPublish}
              className="flex-1 py-3 rounded-xl bg-bembe-teal text-white font-semibold text-sm hover:bg-bembe-teal/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {publishing && <Loader2 className="w-4 h-4 animate-spin" />}
              {publishing ? t.events.event_publishing : t.events.event_publish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
