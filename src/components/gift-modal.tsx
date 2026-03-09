"use client";

import { useState } from "react";
import { Gift, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface GiftModalProps {
  walkId: string;
  walkTitle: string;
  priceCents: number;
  onClose: () => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function GiftModal({
  walkId,
  walkTitle,
  priceCents,
  onClose,
}: GiftModalProps) {
  const { t } = useI18n();
  const [senderName, setSenderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!senderName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walkId,
          senderName: senderName.trim(),
          recipientEmail: recipientEmail.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t.common.error);
        return;
      }

      const { checkoutUrl } = await res.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bembe-night/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl max-h-[90dvh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-bembe-sand/50 transition-colors"
        >
          <X className="h-5 w-5 text-bembe-night/50" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-bembe-gold/20 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5 text-bembe-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-bembe-night">
              {t.gift.title}
            </h2>
            <p className="text-sm text-bembe-night/50">
              {walkTitle} &middot; {formatPrice(priceCents)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender Name */}
          <div>
            <label className="block text-sm font-medium text-bembe-night mb-1">
              {t.gift.your_name}
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-bembe-night/10 bg-bembe-sand/30 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition-all"
              placeholder={t.gift.name_placeholder}
            />
          </div>

          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-medium text-bembe-night mb-1">
              {t.gift.to_email}
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-bembe-night/10 bg-bembe-sand/30 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition-all"
              placeholder="friend@email.com"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-bembe-night mb-1">
              {t.gift.message_placeholder}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 300))}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 bg-bembe-sand/30 text-bembe-night placeholder:text-bembe-night/30 focus:outline-none focus:ring-2 focus:ring-bembe-teal/30 focus:border-bembe-teal transition-all resize-none"
              placeholder={t.gift.message_placeholder}
            />
            <p className="text-xs text-bembe-night/40 text-right mt-1">
              {message.length}/300
            </p>
          </div>

          {/* Info text */}
          <p className="text-xs text-bembe-night/50 text-center">
            {t.gift.redeem_info}
          </p>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !senderName.trim()}
            className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-bembe-coral text-white font-semibold transition-all hover:bg-bembe-coral/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Gift className="h-5 w-5" />
            {loading ? t.gift.processing : t.gift.send}
          </button>
        </form>
      </div>
    </div>
  );
}
