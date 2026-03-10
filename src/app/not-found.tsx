"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bembe-night flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[120px] font-extrabold text-bembe-gold/20 leading-none mb-4">404</p>
      <h1 className="text-2xl font-bold text-white mb-2">{t.not_found_page.title}</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        {t.not_found_page.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 transition"
        >
          {t.not_found_page.go_home}
        </Link>
        <Link
          href="/discover"
          className="px-8 py-3 rounded-full border-2 border-bembe-gold/30 text-bembe-gold font-semibold hover:border-bembe-gold/60 transition"
        >
          {t.not_found_page.explore_walks}
        </Link>
      </div>
    </div>
  );
}
