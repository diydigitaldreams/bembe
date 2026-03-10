"use client";

import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";
import { MapPin, BarChart3, Star, Loader2, Check } from "lucide-react";
import { useState } from "react";

const TIERS = [
  {
    key: "starter" as const,
    walks: 1,
    features: ["feature_pin", "feature_logo"] as const,
  },
  {
    key: "growth" as const,
    walks: 5,
    popular: true,
    features: ["feature_pin", "feature_logo", "feature_report", "feature_priority"] as const,
  },
  {
    key: "premium" as const,
    walks: -1,
    features: [
      "feature_pin",
      "feature_logo",
      "feature_report",
      "feature_analytics",
      "feature_priority",
      "feature_unlimited",
    ] as const,
  },
];

export default function SponsorsPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSignup(tier: string) {
    setLoading(tier);
    try {
      const res = await fetch("/api/sponsors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <MapPin className="h-10 w-10 text-bembe-teal mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-bembe-night sm:text-4xl md:text-5xl">
            {t.sponsors.page_title}
          </h1>
          <p className="mt-4 text-lg text-bembe-night/60 max-w-2xl mx-auto">
            {t.sponsors.page_subtitle}
          </p>
        </div>

        {/* Pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier) => {
            const name = t.sponsors[tier.key];
            const price = t.sponsors[`${tier.key}_price` as keyof typeof t.sponsors];
            const desc = t.sponsors[`${tier.key}_desc` as keyof typeof t.sponsors];

            return (
              <div
                key={tier.key}
                className={`relative rounded-2xl bg-white p-6 shadow-sm border ${
                  tier.popular
                    ? "border-bembe-teal shadow-lg shadow-bembe-teal/10 ring-2 ring-bembe-teal"
                    : "border-bembe-night/5"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bembe-teal text-white text-xs font-semibold">
                    Popular
                  </div>
                )}

                <h3 className="text-lg font-bold text-bembe-night mb-1">{name}</h3>
                <p className="text-sm text-bembe-night/50 mb-4">{desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-bembe-night">{price}</span>
                  <span className="text-sm text-bembe-night/40">{t.sponsors.per_month}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-bembe-night/70">
                      <Check className="h-4 w-4 text-bembe-teal shrink-0" />
                      {t.sponsors[f]}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSignup(tier.key)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
                    tier.popular
                      ? "bg-bembe-teal text-white hover:bg-bembe-teal/90"
                      : "bg-bembe-night/5 text-bembe-night hover:bg-bembe-night/10"
                  }`}
                >
                  {loading === tier.key && <Loader2 className="h-4 w-4 animate-spin" />}
                  {tier.key === "premium" ? t.sponsors.contact_us : t.sponsors.get_started}
                </button>
              </div>
            );
          })}
        </div>

        {/* Features breakdown */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-bembe-night/5">
          <h2 className="text-2xl font-bold text-bembe-night mb-6 text-center">
            {t.sponsors.features_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, text: t.sponsors.feature_pin },
              { icon: Star, text: t.sponsors.feature_logo },
              { icon: BarChart3, text: t.sponsors.feature_report },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-bembe-teal/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-bembe-teal" />
                </div>
                <p className="text-sm text-bembe-night/70 pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
