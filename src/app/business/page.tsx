"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  ArrowRight,
  Check,
  Footprints,
  Heart,
} from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Neighborhood Pin",
    price: 200,
    period: "/mo",
    description: "Your business appears on art walks near your location",
    features: [
      "Pin on walk maps within 500m",
      "Business card shown during nearby stops",
      "Monthly foot traffic report",
      "Listing in Bembe business directory",
    ],
    cta: "Start Sponsoring",
    popular: false,
  },
  {
    name: "Walk Sponsor",
    price: 500,
    period: "/mo",
    description: "Sponsor entire walks and get premium placement",
    features: [
      "Everything in Neighborhood Pin",
      'Branded "Sponsored by" on 3 walks',
      "Audio mention during walk intro",
      "Featured in walk discovery page",
      "QR code kit for your venue",
      "Priority customer support",
    ],
    cta: "Become a Sponsor",
    popular: true,
  },
  {
    name: "Cultural Partner",
    price: 1500,
    period: "/mo",
    description: "Full partnership with co-created art experiences",
    features: [
      "Everything in Walk Sponsor",
      "Custom-branded art walk for your business",
      "Artist collaboration events at your venue",
      "API access for guest app integration",
      "Dedicated account manager",
      "Monthly impact report for ESG",
      "Logo on Bembe homepage",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const STATS = [
  { label: "Monthly Walk Plays", value: "12,000+", icon: Footprints },
  { label: "Active Artists", value: "500+", icon: Heart },
  { label: "Avg. Walk Duration", value: "45 min", icon: Eye },
  { label: "Tourist Reach", value: "85%", icon: Users },
];

export default function BusinessPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Hero */}
      <div className="bg-gradient-to-br from-bembe-night to-bembe-teal text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <Link
            href="/"
            className="text-bembe-gold font-bold text-lg mb-8 inline-block"
          >
            Bembe
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Drive foot traffic
            <br />
            through art.
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8">
            Reach tourists and locals while they explore Puerto Rico&apos;s
            culture. Your business becomes part of the art walk experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bembe-gold text-bembe-night font-semibold rounded-xl hover:bg-bembe-gold/90 transition-colors"
            >
              See Plans <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:partners@bembe.pr"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Talk to Sales
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-bembe-night/5 text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-bembe-teal" />
              <div className="font-bold text-xl text-bembe-night">
                {stat.value}
              </div>
              <div className="text-xs text-bembe-night/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          How Business Sponsorship Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: "1. Choose Your Zone",
              desc: "Select the neighborhoods and art walks near your business. Your pin appears on the map for all walk participants.",
            },
            {
              icon: Eye,
              title: "2. Get Seen by Walkers",
              desc: "As tourists and locals explore art walks, your business card appears when they're nearby. Seamless, non-intrusive exposure.",
            },
            {
              icon: TrendingUp,
              title: "3. Track Your Impact",
              desc: "See real-time analytics on foot traffic, impressions, and walk-ins. Plus, you're supporting local artists — great for ESG reporting.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="bg-white rounded-xl p-6 border border-bembe-night/5"
            >
              <step.icon className="w-8 h-8 text-bembe-teal mb-3" />
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-bembe-night/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="plans" className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-2">
          Sponsorship Plans
        </h2>
        <p className="text-center text-bembe-night/50 mb-10">
          Support local artists. Reach new customers. Make an impact.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-6 border-2 transition-all ${
                plan.popular
                  ? "border-bembe-teal shadow-lg scale-[1.02]"
                  : "border-bembe-night/5"
              } ${selectedPlan === i ? "ring-2 ring-bembe-gold" : ""}`}
              onClick={() => setSelectedPlan(i)}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-bembe-teal text-white text-xs font-bold rounded-full mb-3">
                  MOST POPULAR
                </span>
              )}
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <div className="mt-2 mb-3">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-bembe-night/50 text-sm">
                  {plan.period}
                </span>
              </div>
              <p className="text-sm text-bembe-night/60 mb-4">
                {plan.description}
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-bembe-night/70"
                  >
                    <Check className="w-4 h-4 text-bembe-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  plan.popular
                    ? "bg-bembe-teal text-white hover:bg-bembe-teal/90"
                    : "bg-bembe-night/5 text-bembe-night hover:bg-bembe-night/10"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-bembe-night text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-4 text-bembe-gold" />
          <h2 className="text-2xl font-bold mb-3">
            Hotels & Cruise Lines
          </h2>
          <p className="text-white/60 mb-6">
            Looking for a custom partnership? We offer API integration,
            white-label art walks for your guests, and volume pricing.
          </p>
          <a
            href="mailto:enterprise@bembe.pr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-bembe-gold text-bembe-night font-semibold rounded-xl hover:bg-bembe-gold/90 transition-colors"
          >
            Contact Enterprise Sales <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
