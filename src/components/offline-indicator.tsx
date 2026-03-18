"use client";

import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function OfflineIndicator() {
  const { t } = useI18n();
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Defer initial check to avoid synchronous setState in effect body
    const initTimer = setTimeout(() => setIsOffline(!navigator.onLine), 0);

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-xl bg-bembe-night px-4 py-3 text-white shadow-lg">
        <WifiOff className="h-4 w-4 shrink-0 text-bembe-coral" />
        <p className="flex-1 text-sm">{t.offline.offline_banner}</p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full p-1 hover:bg-white/10 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
