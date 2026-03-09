"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import GiftModal from "./gift-modal";

interface GiftButtonProps {
  walkId: string;
  walkTitle: string;
  priceCents: number;
}

export default function GiftButton({
  walkId,
  walkTitle,
  priceCents,
}: GiftButtonProps) {
  const [showModal, setShowModal] = useState(false);

  if (priceCents === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-bembe-night/10 bg-white text-bembe-coral transition-all hover:bg-bembe-coral/5 active:scale-[0.98]"
        aria-label="Gift this walk"
      >
        <Gift className="h-5 w-5" />
      </button>

      {showModal && (
        <GiftModal
          walkId={walkId}
          walkTitle={walkTitle}
          priceCents={priceCents}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
