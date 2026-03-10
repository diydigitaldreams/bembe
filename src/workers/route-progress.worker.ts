import { lineString, point } from "@turf/turf";
import { nearestPointOnLine, length, lineSlice } from "@turf/turf";

const AVG_WALKING_SPEED_KM_H = 5; // ~1.4 m/s

export interface WorkerInput {
  routeCoordinates: [number, number][];
  userLat: number;
  userLng: number;
  nextStopLat: number | null;
  nextStopLng: number | null;
}

export interface WorkerOutput {
  progress: number;
  distanceToNextStop: number;
  etaToNextStop: number;
  snappedPosition: [number, number] | null;
  completedCoords: [number, number][];
  remainingCoords: [number, number][];
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { routeCoordinates, userLat, userLng, nextStopLat, nextStopLng } =
    e.data;

  try {
    const route = lineString(routeCoordinates);
    const userPt = point([userLng, userLat]);

    const snapped = nearestPointOnLine(route, userPt);
    const snappedCoord = snapped.geometry.coordinates as [number, number];

    const totalLength = length(route, { units: "kilometers" });
    if (totalLength === 0) {
      postEmpty();
      return;
    }

    const startPt = point(routeCoordinates[0]);
    const completedLine = lineSlice(startPt, snapped, route);
    const completedLength = length(completedLine, { units: "kilometers" });
    const progress = Math.min(completedLength / totalLength, 1);

    const endPt = point(routeCoordinates[routeCoordinates.length - 1]);
    const remainingLine = lineSlice(snapped, endPt, route);

    let distanceToNextStop = 0;
    let etaToNextStop = 0;
    if (nextStopLat != null && nextStopLng != null) {
      const nextStopPt = point([nextStopLng, nextStopLat]);
      const snappedNextStop = nearestPointOnLine(route, nextStopPt);
      const segmentToStop = lineSlice(snapped, snappedNextStop, route);
      const distKm = length(segmentToStop, { units: "kilometers" });
      distanceToNextStop = Math.round(distKm * 1000);
      etaToNextStop = Math.round((distKm / AVG_WALKING_SPEED_KM_H) * 3600);
    }

    const result: WorkerOutput = {
      progress,
      distanceToNextStop,
      etaToNextStop,
      snappedPosition: snappedCoord,
      completedCoords: completedLine.geometry
        .coordinates as [number, number][],
      remainingCoords: remainingLine.geometry
        .coordinates as [number, number][],
    };

    self.postMessage(result);
  } catch {
    postEmpty();
  }
};

function postEmpty() {
  const empty: WorkerOutput = {
    progress: 0,
    distanceToNextStop: 0,
    etaToNextStop: 0,
    snappedPosition: null,
    completedCoords: [],
    remainingCoords: [],
  };
  self.postMessage(empty);
}
