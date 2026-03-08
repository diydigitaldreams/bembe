import type { ArtWalk } from "@/types";

const DB_NAME = "bembe-offline";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("walks")) {
        db.createObjectStore("walks", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("audio")) {
        db.createObjectStore("audio", { keyPath: "stopId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveWalkOffline(walk: ArtWalk): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("walks", "readwrite");
    tx.objectStore("walks").put(walk);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineWalk(
  walkId: string
): Promise<ArtWalk | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("walks", "readonly");
    const request = tx.objectStore("walks").get(walkId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllOfflineWalks(): Promise<ArtWalk[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("walks", "readonly");
    const request = tx.objectStore("walks").getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removeOfflineWalk(walkId: string): Promise<void> {
  // Read walk first so we know which audio blobs to clean up
  const walk = await getOfflineWalk(walkId);

  const db = await openDB();

  // Remove walk data
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("walks", "readwrite");
    tx.objectStore("walks").delete(walkId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  // Also remove associated audio blobs
  if (walk?.stops) {
    const db2 = await openDB();
    const tx = db2.transaction("audio", "readwrite");
    const store = tx.objectStore("audio");
    for (const stop of walk.stops) {
      store.delete(stop.id);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export async function saveAudioBlob(
  stopId: string,
  blob: Blob
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("audio", "readwrite");
    tx.objectStore("audio").put({ stopId, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAudioBlob(stopId: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("audio", "readonly");
    const request = tx.objectStore("audio").get(stopId);
    request.onsuccess = () =>
      resolve(request.result ? request.result.blob : null);
    request.onerror = () => reject(request.error);
  });
}

export async function isWalkDownloaded(walkId: string): Promise<boolean> {
  const walk = await getOfflineWalk(walkId);
  return walk !== null;
}
