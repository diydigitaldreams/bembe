import mapboxgl from "mapbox-gl";
import type { WalkStop } from "@/types";

/** Compute bounds from stops and fit the map to show all of them. */
export function fitBoundsFromStops(
  map: mapboxgl.Map,
  stops: Pick<WalkStop, "lat" | "lng">[],
  options?: { padding?: number; maxZoom?: number; animate?: boolean }
) {
  if (stops.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();
  for (const s of stops) {
    bounds.extend([s.lng, s.lat]);
  }

  map.fitBounds(bounds, {
    padding: options?.padding ?? 48,
    maxZoom: options?.maxZoom ?? 16,
    animate: options?.animate ?? false,
  });
}

/** Create numbered circle marker elements for each stop and add them to the map. */
export function addStopMarkers(
  map: mapboxgl.Map,
  stops: Pick<WalkStop, "lat" | "lng">[],
  currentIndex?: number
): mapboxgl.Marker[] {
  return stops.map((stop, i) => {
    const el = document.createElement("div");
    const isCurrent = currentIndex !== undefined && i === currentIndex;
    const isCompleted = currentIndex !== undefined && i < currentIndex;
    el.style.cssText = `
      width: 28px; height: 28px; border-radius: 50%;
      background: ${isCurrent ? "#1A7A6D" : isCompleted ? "#1A7A6D" : "#D4A843"};
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 12px; font-weight: bold;
    `;
    el.textContent = isCompleted ? "\u2713" : String(i + 1);

    return new mapboxgl.Marker({ element: el })
      .setLngLat([stop.lng, stop.lat])
      .addTo(map);
  });
}

/**
 * Add a route line layer from GeoJSON coordinates.
 * If `routeGeojson` is provided (real walking route from Directions API), use it.
 * Otherwise fall back to straight lines between stops.
 */
export function addRouteLayer(
  map: mapboxgl.Map,
  stops: Pick<WalkStop, "lat" | "lng">[],
  routeGeojson?: GeoJSON.LineString | null,
  sourceId = "route"
) {
  const geometry: GeoJSON.LineString = routeGeojson ?? {
    type: "LineString",
    coordinates: stops.map((s) => [s.lng, s.lat]),
  };

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
      type: "Feature",
      properties: {},
      geometry,
    });
    return;
  }

  map.addSource(sourceId, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry,
    },
  });

  map.addLayer({
    id: sourceId,
    type: "line",
    source: sourceId,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#1A7A6D",
      "line-width": 3,
      "line-opacity": 0.6,
      "line-dasharray": [2, 2],
    },
  });
}

/**
 * Add completed/remaining route layers for the walk player.
 * Shows solid line for completed portion and dashed for remaining.
 */
export function addProgressRouteLayers(
  map: mapboxgl.Map,
  completedGeometry: GeoJSON.LineString | null,
  remainingGeometry: GeoJSON.LineString | null
) {
  // Completed route (solid, brighter)
  const completedId = "route-completed";
  if (completedGeometry) {
    if (map.getSource(completedId)) {
      (map.getSource(completedId) as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: completedGeometry,
      });
    } else {
      map.addSource(completedId, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: completedGeometry },
      });
      map.addLayer({
        id: completedId,
        type: "line",
        source: completedId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1A7A6D",
          "line-width": 5,
          "line-opacity": 0.9,
        },
      });
    }
  }

  // Remaining route (dashed, dimmer)
  const remainingId = "route-remaining";
  if (remainingGeometry) {
    if (map.getSource(remainingId)) {
      (map.getSource(remainingId) as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: remainingGeometry,
      });
    } else {
      map.addSource(remainingId, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: remainingGeometry },
      });
      map.addLayer({
        id: remainingId,
        type: "line",
        source: remainingId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1A7A6D",
          "line-width": 3,
          "line-opacity": 0.4,
          "line-dasharray": [2, 2],
        },
      });
    }
  }
}
