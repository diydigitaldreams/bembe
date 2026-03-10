import { useEffect, useRef, useState, useMemo } from "react";

export interface RouteProgress {
  progress: number;
  distanceToNextStop: number;
  etaToNextStop: number;
  snappedPosition: [number, number] | null;
  completedCoords: [number, number][];
  remainingCoords: [number, number][];
}

const EMPTY: RouteProgress = {
  progress: 0,
  distanceToNextStop: 0,
  etaToNextStop: 0,
  snappedPosition: null,
  completedCoords: [],
  remainingCoords: [],
};

export function useRouteProgress(
  routeCoordinates: [number, number][] | null,
  userLat: number | null,
  userLng: number | null,
  nextStopLat: number | null,
  nextStopLng: number | null
): RouteProgress {
  const [workerResult, setWorkerResult] = useState<RouteProgress | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const hasValidInput =
    routeCoordinates != null &&
    routeCoordinates.length >= 2 &&
    userLat != null &&
    userLng != null;

  // Create worker on mount
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/route-progress.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (e: MessageEvent<RouteProgress>) => {
      setWorkerResult(e.data);
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Post to worker when inputs change (only when valid)
  useEffect(() => {
    if (!workerRef.current || !hasValidInput) return;

    workerRef.current.postMessage({
      routeCoordinates,
      userLat,
      userLng,
      nextStopLat,
      nextStopLng,
    });
  }, [routeCoordinates, userLat, userLng, nextStopLat, nextStopLng, hasValidInput]);

  return useMemo(
    () => (hasValidInput && workerResult ? workerResult : EMPTY),
    [hasValidInput, workerResult]
  );
}
