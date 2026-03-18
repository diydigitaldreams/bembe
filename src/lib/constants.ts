// ---------------------------------------------------------------------------
// Shared application constants
// ---------------------------------------------------------------------------

/** Default coordinates: San Juan, Puerto Rico */
export const DEFAULT_COORDINATES = {
  lat: 18.4655,
  lng: -66.1057,
} as const;

/** Fallback app URL when NEXT_PUBLIC_APP_URL is not set */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Geolocation watch timeout in milliseconds */
export const GEOLOCATION_TIMEOUT_MS = 15_000;
