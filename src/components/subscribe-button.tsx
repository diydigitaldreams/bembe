"use client";

import { useState } from "react";
import { Heart, Check, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface SubscribeButtonProps {
  artistId: string;
  artistName: string;
  isSubscribed?: boolean;
}

export function SubscribeButton({
  artistId,
  artistName,
  isSubscribed = false,
}: SubscribeButtonProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (isSubscribed || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      setLoading(false);
    }
  }

  if (isSubscribed) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-bembe-gold/20 text-bembe-gold font-medium rounded-xl text-sm cursor-default"
      >
        <Check className="w-4 h-4" />
        {t.subscription.subscribed}
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-bembe-coral text-white font-medium rounded-xl text-sm hover:bg-bembe-coral/90 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className="w-4 h-4" />
      )}
      {t.subscription.subscribe} {t.subscription.price}
    </button>
  );
}
