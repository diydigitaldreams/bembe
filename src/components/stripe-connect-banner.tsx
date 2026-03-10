"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface StripeConnectBannerProps {
  stripeAccountId: string | null | undefined;
}

export default function StripeConnectBanner({
  stripeAccountId,
}: StripeConnectBannerProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  if (stripeAccountId) {
    return null;
  }

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch("/api/artist/connect", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        console.error("Connect error:", data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-bembe-gold/30 bg-bembe-gold/10 p-6">
      <h3 className="text-lg font-semibold text-bembe-night mb-1">
        {t.stripe.connect_title}
      </h3>
      <p className="text-sm text-bembe-night/60 mb-4">
        {t.stripe.connect_description}
      </p>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 active:scale-[0.98] transition disabled:opacity-60 disabled:pointer-events-none text-sm"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {t.stripe.connect_button}
      </button>
    </div>
  );
}
