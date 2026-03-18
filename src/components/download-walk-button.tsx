"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  saveWalkOffline,
  isWalkDownloaded,
  removeOfflineWalk,
} from "@/lib/offline/db";
import type { ArtWalk } from "@/types";

interface DownloadWalkButtonProps {
  walkId: string;
  walk: ArtWalk;
}

export default function DownloadWalkButton({
  walkId,
  walk,
}: DownloadWalkButtonProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");

  useEffect(() => {
    isWalkDownloaded(walkId).then((downloaded) => {
      if (downloaded) setStatus("downloaded");
    });
  }, [walkId]);

  async function handleDownload() {
    if (status === "downloading") return;

    setStatus("downloading");
    try {
      // Save walk data to IndexedDB
      await saveWalkOffline(walk);

      // Collect audio URLs from stops
      const audioUrls: string[] = [];
      if (walk.stops) {
        for (const stop of walk.stops) {
          if (stop.audio_url) {
            audioUrls.push(stop.audio_url);
          }
        }
      }

      // Cache audio URLs via service worker
      if (audioUrls.length > 0 && navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_AUDIO",
          urls: audioUrls,
        });
      }

      setStatus("downloaded");
    } catch (err) {
      console.error("Walk download failed:", err);
      setStatus("idle");
    }
  }

  async function handleRemove() {
    await removeOfflineWalk(walkId);
    setStatus("idle");
  }

  if (status === "downloaded") {
    return (
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 rounded-full bg-bembe-teal/10 px-4 py-2 text-sm font-medium text-bembe-teal"
          disabled
        >
          <CheckCircle className="h-4 w-4" />
          {t.offline.downloaded}
        </button>
        <button
          onClick={handleRemove}
          className="flex h-11 w-11 items-center justify-center rounded-full text-xs text-bembe-night/50 hover:text-bembe-coral transition-colors"
          title={t.offline.remove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (status === "downloading") {
    return (
      <button
        className="flex items-center gap-2 rounded-full bg-bembe-night/5 px-4 py-2 text-sm font-medium text-bembe-night/60"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {t.offline.downloading}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-full bg-bembe-night/5 px-4 py-2 text-sm font-medium text-bembe-night/70 hover:bg-bembe-teal/10 hover:text-bembe-teal transition-colors"
    >
      <Download className="h-4 w-4" />
      {t.offline.download}
    </button>
  );
}
