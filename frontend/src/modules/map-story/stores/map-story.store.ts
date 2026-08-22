import { create } from "zustand";

import type { MapLocationState } from "../types";

interface MapStoryState {
  locationsBySession: Record<number, Record<number, MapLocationState>>;
  setLocation: (sessionId: number, location: MapLocationState) => void;
  clearSession: (sessionId: number) => void;
}

export const useMapStoryStore = create<MapStoryState>((set) => ({
  locationsBySession: {},
  setLocation: (sessionId, location) =>
    set((state) => ({
      locationsBySession: {
        ...state.locationsBySession,
        [sessionId]: {
          ...(state.locationsBySession[sessionId] ?? {}),
          [location.userId]: location,
        },
      },
    })),
  clearSession: (sessionId) =>
    set((state) => {
      const next = { ...state.locationsBySession };
      delete next[sessionId];

      return { locationsBySession: next };
    }),
}));
