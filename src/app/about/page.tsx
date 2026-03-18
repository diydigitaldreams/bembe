"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import { useI18n } from "@/lib/i18n/context";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bembe-sand">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-bembe-teal mb-6">
          {t.about.title}
        </h1>

        <div className="space-y-6 text-bembe-night/70 leading-relaxed">
          <p>{t.about.intro}</p>

          <p className="text-lg font-medium text-bembe-night">
            {t.about.tagline}
          </p>

          <h2 className="text-2xl font-bold text-bembe-night pt-4">
            {t.about.for_artists_title}
          </h2>
          <p>{t.about.for_artists_desc}</p>

          <h2 className="text-2xl font-bold text-bembe-night pt-4">
            {t.about.for_patrons_title}
          </h2>
          <p>{t.about.for_patrons_desc}</p>

          <h2 className="text-2xl font-bold text-bembe-night pt-4">
            {t.about.contact_title}
          </h2>
          <p>
            <a
              href="mailto:hola@bembe.pr"
              className="text-bembe-teal hover:underline"
            >
              hola@bembe.pr
            </a>
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-bembe-teal hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.about.back_home}
          </Link>
        </div>
      </main>
    </div>
  );
}
