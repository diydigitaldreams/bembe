"use client";

import { useI18n } from "@/lib/i18n/context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "es" : "en")}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-bembe-night/5 hover:bg-bembe-night/10 transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
