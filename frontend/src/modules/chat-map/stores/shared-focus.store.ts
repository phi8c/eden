"use client";

import { create } from "zustand";

import { MAP_CONFIG } from "@/modules/map/constants/map-config";
import type { SharedFocusPoint } from "@/modules/map/types/map.types";

interface SharedFocusState {
  focusPoint: SharedFocusPoint | null;
  setFocusPoint: (point: SharedFocusPoint) => void;
  clearFocusPoint: () => void;
}

let clearTimer: ReturnType<typeof setTimeout> | null = null;

export const useSharedFocusStore = create<SharedFocusState>((set) => ({
  focusPoint: null,
  setFocusPoint: (point) => {
    if (clearTimer) {
      clearTimeout(clearTimer);
    }

    set({ focusPoint: point });

    clearTimer = setTimeout(() => {
      set({ focusPoint: null });
      clearTimer = null;
    }, MAP_CONFIG.focusTtlMs);
  },
  clearFocusPoint: () => {
    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }

    set({ focusPoint: null });
  },
}));
