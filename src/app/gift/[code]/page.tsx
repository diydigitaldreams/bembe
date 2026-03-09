"use client";

import { useEffect, useState } from "react";
import { Gift, Play, LogIn } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface GiftData {
  walk_title: string;
  sender_name: string;
  message: string | null;
  status: string;
  walk_id: string;
  neighborhood: string;
}

export default function GiftRedemptionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { t } = useI18n();
  const [giftCode, setGiftCode] = useState<string>("");
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ code }) => {
      setGiftCode(code);
      fetchGift(code);
    });
  }, [params]);

  async function fetchGift(code: string) {
    try {
      const res = await fetch(`/api/gifts/${code}`);
      if (!res.ok) {
        setError("Gift not found");
        return;
      }
      const data = await res.json();
      setGift(data);
    } catch {
      setError("Failed to load gift");
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem() {
    setRedeeming(true);
    try {
      const res = await fetch(`/api/gifts/${giftCode}/redeem`, {
        method: "POST",
      });
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to redeem gift");
        return;
      }
      setRedeemed(true);
    } catch {
      setError("Failed to redeem gift");
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-bembe-teal via-bembe-teal/80 to-bembe-coral/60 flex items-center justify-center">
        <div className="text-white text-lg">{t.common.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-bembe-teal via-bembe-teal/80 to-bembe-coral/60 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <p className="text-bembe-night/70">{error}</p>
          <Link
            href="/discover"
            className="mt-4 inline-block px-6 py-3 bg-bembe-teal text-white rounded-xl font-semibold"
          >
            {t.landing.cta_explore}
          </Link>
        </div>
      </div>
    );
  }

  if (!gift) return null;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-bembe-teal via-bembe-teal/80 to-bembe-coral/60 flex items-center justify-center px-5 py-12">
      {/* Overlay pattern */}
      <div className="fixed inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />

      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl relative z-10">
        {/* Gift icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-bembe-gold/20 flex items-center justify-center">
            <Gift className="h-8 w-8 text-bembe-gold" />
          </div>
        </div>

        {/* Received text */}
        <h1 className="text-2xl font-bold text-bembe-night text-center mb-1">
          {t.gift.received}
        </h1>

        {/* Walk title */}
        <p className="text-center text-bembe-teal font-semibold text-lg mb-4">
          {gift.walk_title}
        </p>

        {/* Sender info */}
        <div className="bg-bembe-sand/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-bembe-night/60 mb-1">
            {t.gift.from}: <span className="font-semibold text-bembe-night">{gift.sender_name}</span>
          </p>
          {gift.message && (
            <p className="text-sm text-bembe-night/70 italic mt-2">
              &ldquo;{gift.message}&rdquo;
            </p>
          )}
        </div>

        {/* Neighborhood badge */}
        {gift.neighborhood && (
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded-full bg-bembe-teal/10 text-bembe-teal text-xs font-medium">
              {gift.neighborhood}
            </span>
          </div>
        )}

        {/* Actions */}
        {redeemed ? (
          <div className="text-center">
            <p className="text-bembe-teal font-semibold mb-4">
              {"Walk added to your library!"}
            </p>
            <Link
              href={`/walk/${gift.walk_id}/play`}
              className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-bembe-teal text-white font-semibold transition-all hover:bg-bembe-teal/90 active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-white" />
              {t.walk.start}
            </Link>
          </div>
        ) : needsLogin ? (
          <div className="text-center">
            <p className="text-sm text-bembe-night/60 mb-4">
              {t.gift.login_to_redeem}
            </p>
            <Link
              href={`/login?redirect=/gift/${giftCode}`}
              className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-bembe-coral text-white font-semibold transition-all hover:bg-bembe-coral/90 active:scale-[0.98]"
            >
              <LogIn className="h-5 w-5" />
              {t.nav.login}
            </Link>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={redeeming || gift.status !== "paid"}
            className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-bembe-teal text-white font-semibold transition-all hover:bg-bembe-teal/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Gift className="h-5 w-5" />
            {redeeming ? t.gift.processing : t.gift.redeem}
          </button>
        )}
      </div>
    </div>
  );
}
