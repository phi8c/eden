import { useEffect, useState } from "react";

import { socketManager } from "@/modules/realtime/managers/socket-manager";

export function useMapLocationSharing(sessionId: number | null, enabled: boolean) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !enabled) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Trinh duyet khong ho tro dinh vi.");
      return;
    }

    const sendPosition = (position: GeolocationPosition) => {
      setError(null);
      socketManager.location.updateMapLocation(sessionId, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    };

    navigator.geolocation.getCurrentPosition(
      sendPosition,
      (geoError) => {
        setError(geoError.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    const watchId = navigator.geolocation.watchPosition(
      sendPosition,
      (geoError) => {
        setError(geoError.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, sessionId]);

  return { error };
}
