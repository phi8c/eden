import { useEffect } from "react";

import { socketManager } from "@/modules/realtime/managers/socket-manager";
import { useMapStoryStore } from "../stores";
import type { MapLocationState } from "../types";

export function useMapRealtime(
  sessionId: number | null,
  initialLocations: MapLocationState[] = [],
) {
  const setLocation = useMapStoryStore((state) => state.setLocation);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    initialLocations.forEach((location) => {
      setLocation(sessionId, location);
    });
  }, [initialLocations, sessionId, setLocation]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    return socketManager.location.onMapLocation((event) => {
      if (event.sessionId !== sessionId) {
        return;
      }

      setLocation(event.sessionId, event.location);
    });
  }, [sessionId, setLocation]);

}
