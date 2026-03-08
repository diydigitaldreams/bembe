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
import { useI18n } from "@/lib/i18n/context";

export default function BusinessPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const { t } = useI18n();

  const PLANS = [
    {
      name: t.business.plan1_name,
      price: 200,
      period: t.business.mo,
      description: t.business.plan1_desc,
      features: [
        "Pin on walk maps within 500m",
        "Business card shown during nearby stops",
        "Monthly foot traffic report",
        "Listing in Bembe business directory",
      ],
      cta: t.business.plan1_cta,
      popular: false,
    },
    {
      name: t.business.plan2_name,
      price: 500,
      period: t.business.mo,
      description: t.business.plan2_desc,
      features: [
        "Everything in Neighborhood Pin",
        'Branded "Sponsored by" on 3 walks',
        "Audio mention during walk intro",
        "Featured in walk discovery page",
        "QR code kit for your venue",
        "Priority customer support",
      ],
      cta: t.business.plan2_cta,
      popular: true,
    },
    {
      name: t.business.plan3_name,
      price: 1500,
      period: t.business.mo,
      description: t.business.plan3_desc,
      features: [
        "Everything in Walk Sponsor",
        "Custom-branded art walk for your business",
        "Artist collaboration events at your venue",
        "API access for guest app integration",
        "Dedicated account manager",
        "Monthly impact report for ESG",
        "Logo on Bembe homepage",
      ],
      cta: t.business.plan3_cta,
      popular: false,
    },
  ];

  const STATS = [
    { label: t.business.monthly_plays, value: "12,000+", icon: Footprints },
    { label: t.business.active_artists, value: "500+", icon: Heart },
    { label: t.business.avg_duration, value: "45 min", icon: Eye },
    { label: t.business.tourist_reach, value: "85%", icon: Users },
  ];

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
            {t.business.hero_title_1}
            <br />
            {t.business.hero_title_2}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8">
            {t.business.hero_subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bembe-gold text-bembe-night font-semibold rounded-xl hover:bg-bembe-gold/90 transition-colors"
            >
              {t.business.see_plans} <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:partners@bembe.pr"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              {t.business.talk_sales}
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
          {t.business.how_title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: t.business.how_step1_title,
              desc: t.business.how_step1_desc,
            },
            {
              icon: Eye,
              title: t.business.how_step2_title,
              desc: t.business.how_step2_desc,
            },
            {
              icon: TrendingUp,
              title: t.business.how_step3_title,
              desc: t.business.how_step3_desc,
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
          {t.business.plans_title}
        </h2>
        <p className="text-center text-bembe-night/50 mb-10">
          {t.business.plans_subtitle}
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
                  {t.business.most_popular}
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
            {t.business.enterprise_title}
          </h2>
          <p className="text-white/60 mb-6">
            {t.business.enterprise_desc}
          </p>
          <a
            href="mailto:enterprise@bembe.pr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-bembe-gold text-bembe-night font-semibold rounded-xl hover:bg-bembe-gold/90 transition-colors"
          >
            {t.business.enterprise_cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
