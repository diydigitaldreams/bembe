"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { X, Heart } from "lucide-react";

interface TipModalProps {
  artistId: string;
  artistName: string;
  open: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [200, 500, 1000, 2500]; // cents

export default function TipModal({
  artistId,
  artistName,
  open,
  onClose,
}: TipModalProps) {
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const amountCents = isCustom
    ? Math.round(parseFloat(customAmount || "0") * 100)
    : selectedAmount;

  const isValid = amountCents && amountCents >= 200;

  async function handleSendTip() {
    if (!isValid || !amountCents) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          amount: amountCents,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create tip session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bembe-night/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-auto p-6 animate-in slide-in-from-bottom duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-bembe-sand transition-colors"
        >
          <X className="w-5 h-5 text-bembe-night/40" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-bembe-coral/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-bembe-coral" />
          </div>
          <h2 className="text-lg font-bold text-bembe-night">
            {t.tips.title}
          </h2>
          <p className="text-sm text-bembe-night/50">
            {t.tips.subtitle} {artistName}
          </p>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {PRESET_AMOUNTS.map((cents) => (
            <button
              key={cents}
              onClick={() => {
                setSelectedAmount(cents);
                setIsCustom(false);
              }}
              className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                !isCustom && selectedAmount === cents
                  ? "bg-bembe-teal text-white"
                  : "bg-bembe-sand text-bembe-night hover:bg-bembe-teal/10"
              }`}
            >
              ${cents / 100}
            </button>
          ))}
          <button
            onClick={() => {
              setIsCustom(true);
              setSelectedAmount(null);
            }}
            className={`py-3 rounded-xl text-sm font-medium transition-colors ${
              isCustom
                ? "bg-bembe-teal text-white"
                : "bg-bembe-sand text-bembe-night hover:bg-bembe-teal/10"
            }`}
          >
            {t.tips.custom}
          </button>
        </div>

        {/* Custom amount input */}
        {isCustom && (
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bembe-night/40 font-medium">
                $
              </span>
              <input
                id="tip-custom-amount"
                type="number"
                min="2"
                max="500"
                step="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                aria-label="Custom tip amount"
                className="w-full pl-7 pr-4 py-3 rounded-xl border border-bembe-night/10 focus:border-bembe-teal focus:ring-1 focus:ring-bembe-teal outline-none text-bembe-night"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Message field */}
        <div className="mb-6">
          <textarea
            id="tip-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 200))}
            placeholder={t.tips.message_placeholder}
            aria-label="Tip message"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-bembe-night/10 focus:border-bembe-teal focus:ring-1 focus:ring-bembe-teal outline-none text-bembe-night text-sm resize-none placeholder:text-bembe-night/30"
          />
          <div className="text-right text-xs text-bembe-night/30 mt-1">
            {message.length}/200
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSendTip}
          disabled={!isValid || loading}
          className="w-full py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-bembe-coral hover:bg-bembe-coral/90"
        >
          {loading ? t.tips.processing : t.tips.send}
          {!loading && isValid && amountCents
            ? ` — $${(amountCents / 100).toFixed(2)}`
            : ""}
        </button>
      </div>
    </div>
  );
}
