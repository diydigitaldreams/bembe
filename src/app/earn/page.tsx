"use client";

import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";
import { DollarSign, Heart, Gift, CreditCard, TrendingUp, ArrowRight } from "lucide-react";

export default function EarnPage() {
  const { t } = useI18n();

  const earningsExamples = [
    { plays: 50, price: 5, earned: 220 },
    { plays: 200, price: 5, earned: 880 },
    { plays: 500, price: 5, earned: 2200 },
  ];

  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Hero */}
      <section className="px-4 pt-24 pb-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-bembe-night tracking-tight">
          {t.earn.hero_title}
        </h1>
        <p className="mt-4 text-lg text-bembe-night/60 max-w-2xl mx-auto">
          {t.earn.hero_subtitle}
        </p>
      </section>

      {/* Revenue Split */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8">
          <h2 className="text-2xl font-bold text-bembe-night mb-4">
            {t.earn.revenue_title}
          </h2>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 bg-bembe-teal/10 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-bembe-teal mx-auto mb-2" />
              <p className="text-3xl font-bold text-bembe-teal">88%</p>
              <p className="text-sm text-bembe-night/70 mt-1">{t.earn.revenue_artist}</p>
            </div>
            <div className="flex-1 bg-bembe-night/5 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-bembe-night/60 mt-10">12%</p>
              <p className="text-sm text-bembe-night/50 mt-1">{t.earn.revenue_bembe}</p>
            </div>
          </div>
          <p className="text-bembe-night/60">
            {t.earn.revenue_desc}
          </p>
        </div>
      </section>

      {/* Income Streams */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-bembe-night mb-6">
          {t.earn.streams_title}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-6">
            <DollarSign className="w-8 h-8 text-bembe-teal mb-3" />
            <h3 className="text-lg font-semibold text-bembe-night mb-2">
              {t.earn.stream_walks}
            </h3>
            <p className="text-sm text-bembe-night/60">{t.earn.stream_walks_desc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-6">
            <Heart className="w-8 h-8 text-bembe-coral mb-3" />
            <h3 className="text-lg font-semibold text-bembe-night mb-2">
              {t.earn.stream_tips}
            </h3>
            <p className="text-sm text-bembe-night/60">{t.earn.stream_tips_desc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-6">
            <Gift className="w-8 h-8 text-bembe-gold mb-3" />
            <h3 className="text-lg font-semibold text-bembe-night mb-2">
              {t.earn.stream_gifts}
            </h3>
            <p className="text-sm text-bembe-night/60">{t.earn.stream_gifts_desc}</p>
          </div>
        </div>
      </section>

      {/* Example Earnings Table */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8">
          <h2 className="text-2xl font-bold text-bembe-night mb-6">
            {t.earn.earnings_title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-bembe-night/10">
                  <th className="pb-3 text-sm font-semibold text-bembe-night/70">
                    {t.earn.earnings_plays}
                  </th>
                  <th className="pb-3 text-sm font-semibold text-bembe-night/70">
                    {t.earn.earnings_price}
                  </th>
                  <th className="pb-3 text-sm font-semibold text-bembe-teal">
                    {t.earn.earnings_you_earn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {earningsExamples.map((row) => (
                  <tr key={row.plays} className="border-b border-bembe-night/5 last:border-0">
                    <td className="py-4 text-bembe-night">{row.plays}</td>
                    <td className="py-4 text-bembe-night">${row.price}</td>
                    <td className="py-4 font-semibold text-bembe-teal">
                      ${row.earned.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8">
          <h2 className="text-2xl font-bold text-bembe-night mb-3">
            {t.earn.tips_title}
          </h2>
          <p className="text-bembe-night/60">{t.earn.tips_desc}</p>
        </div>
      </section>

      {/* Stripe Connect / Payouts */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg shadow-bembe-night/5 p-8 flex items-start gap-4">
          <CreditCard className="w-8 h-8 text-bembe-teal flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-bembe-night mb-3">
              {t.earn.payout_title}
            </h2>
            <p className="text-bembe-night/60">{t.earn.payout_desc}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 max-w-4xl mx-auto text-center">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-bembe-teal text-white font-semibold text-lg hover:bg-bembe-teal/90 active:scale-[0.98] transition"
        >
          {t.earn.cta}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
