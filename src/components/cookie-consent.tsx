"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

const STORAGE_KEY = "bembe-cookie-consent";

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl shadow-bembe-night/10 border border-bembe-night/5 p-5">
        <p className="text-sm text-bembe-night/70 leading-relaxed mb-4">
          {t.cookie.description}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-xl bg-bembe-teal text-white text-sm font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition"
          >
            {t.cookie.accept}
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2.5 rounded-xl border border-bembe-night/10 text-bembe-night/60 text-sm font-medium hover:bg-bembe-sand/50 active:scale-[0.98] transition"
          >
            {t.cookie.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
