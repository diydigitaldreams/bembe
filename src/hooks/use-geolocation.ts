"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  isTracking: boolean;
}

export function useGeolocation(enabled = true) {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    isTracking: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser.",
        isTracking: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isTracking: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isTracking: true,
        });
      },
      (err) => {
        let message = "Unknown error.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "Location permission denied.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Location unavailable.";
            break;
          case err.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        setState((prev) => ({
          ...prev,
          error: message,
          isTracking: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    }
    return () => {
      stopTracking();
    };
  }, [enabled, startTracking, stopTracking]);

  return { ...state, startTracking, stopTracking };
}
