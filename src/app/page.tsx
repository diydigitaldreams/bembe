"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Headphones, MapPin, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import WalkCard from "@/components/walk-card";
import { useI18n } from "@/lib/i18n/context";

import type { ArtWalk } from "@/types";

export default function Home() {
  const { t } = useI18n();
  const [featuredWalks, setFeaturedWalks] = useState<ArtWalk[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/walks?featured=true&limit=3");
        const data = await res.json();
        if (data.walks && data.walks.length > 0) {
          setFeaturedWalks(data.walks);
        }
      } catch {
        // API unavailable
      }
    }
    fetchFeatured();
  }, []);

  const steps = [
    {
      icon: MapPin,
      title: t.landing.how_step1_title,
      description: t.landing.how_step1_desc,
    },
    {
      icon: Headphones,
      title: t.landing.how_step2_title,
      description: t.landing.how_step2_desc,
    },
    {
      icon: Heart,
      title: t.landing.how_step3_title,
      description: t.landing.how_step3_desc,
    },
  ];

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-bembe-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-bembe-coral/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-bembe-night sm:text-5xl md:text-6xl lg:text-7xl">
              {t.landing.hero_title_1}{" "}
              <span className="text-bembe-teal">{t.landing.hero_title_2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-bembe-night/60 sm:text-xl">
              {t.landing.hero_subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-full bg-bembe-teal px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90 hover:shadow-xl hover:shadow-bembe-teal/30"
              >
                {t.landing.cta_explore}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup?role=artist"
                className="inline-flex items-center gap-2 rounded-full border-2 border-bembe-night/10 bg-white px-8 py-3.5 text-base font-semibold text-bembe-night transition-all hover:border-bembe-coral/30 hover:text-bembe-coral"
              >
                {t.landing.cta_artist}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-bembe-night/5 bg-white/50">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-bembe-night/5 px-4 py-10 sm:py-14">
          {[
            {
              label: t.landing.stats_artists,
              sub: t.landing.stats_artists_sub,
            },
            {
              label: t.landing.stats_walks,
              sub: t.landing.stats_walks_sub,
            },
            {
              label: "12 " + t.landing.stats_neighborhoods,
              sub: t.landing.stats_neighborhoods_sub,
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold text-bembe-teal sm:text-xl">
                {stat.label}
              </span>
              <span className="text-xs font-medium text-bembe-night/40 sm:text-sm">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Walks */}
      {featuredWalks.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-bembe-night sm:text-3xl">
                {t.landing.featured_title}
              </h2>
            </div>
            <Link
              href="/discover"
              className="hidden items-center gap-1 text-sm font-semibold text-bembe-teal transition-colors hover:text-bembe-teal/80 sm:inline-flex"
            >
              {t.landing.featured_view_all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWalks.map((walk) => (
              <WalkCard key={walk.id} walk={walk} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1 text-sm font-semibold text-bembe-teal"
            >
              {t.landing.featured_view_all}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-bembe-night sm:text-4xl">
              {t.landing.featured_empty_title}
            </h2>
            <p className="mt-4 text-bembe-night/50">
              {t.landing.featured_empty_desc}
            </p>
            <Link
              href="/signup?role=artist"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-bembe-teal px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-bembe-teal/25 transition-all hover:bg-bembe-teal/90"
            >
              {t.landing.featured_empty_cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-bembe-night sm:text-3xl">
              {t.landing.how_title}
            </h2>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bembe-teal/10">
                  <step.icon className="h-7 w-7 text-bembe-teal" />
                </div>
                <span className="mt-1 text-xs font-bold text-bembe-teal/60">
                  {t.landing.how_step} {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-bembe-night">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-bembe-night/50">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-bembe-teal to-emerald-600 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-20">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            {t.landing.artist_cta_title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
            {t.landing.artist_cta_desc}
          </p>
          <Link
            href="/signup?role=artist"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-bembe-teal shadow-lg transition-all hover:shadow-xl"
          >
            {t.landing.artist_cta_button}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bembe-night/5 bg-white/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <span className="text-xl font-bold text-bembe-gold">Bembe</span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-bembe-night/50">
                {t.landing.footer_copyright}
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-bembe-night/40">
                {t.landing.footer_explore}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { href: "/discover", label: t.landing.footer_all_walks },
                  { href: "/neighborhoods", label: t.landing.footer_neighborhoods },
                  { href: "/discover", label: t.landing.footer_free_walks },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-bembe-night/60 transition-colors hover:text-bembe-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Artists */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-bembe-night/40">
                {t.landing.footer_artists}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { href: "/artist/walks/new", label: t.landing.footer_create_walk },
                  { href: "/artist/dashboard", label: t.landing.footer_artist_dashboard },
                  { href: "/grants", label: t.landing.footer_grant_assistant },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-bembe-night/60 transition-colors hover:text-bembe-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-bembe-night/40">
                {t.landing.footer_company}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  { href: "/about", label: t.landing.footer_about },
                  { href: "/privacy", label: t.landing.footer_privacy },
                  { href: "/terms", label: t.landing.footer_terms },
                  { href: "/refunds", label: t.landing.footer_refunds },
                  { href: "mailto:hola@bembe.pr", label: t.landing.footer_contact },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bembe-night/60 transition-colors hover:text-bembe-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-bembe-night/5 pt-8 text-center text-xs text-bembe-night/40">
            &copy; {new Date().getFullYear()} Bembe. {t.landing.footer_copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
