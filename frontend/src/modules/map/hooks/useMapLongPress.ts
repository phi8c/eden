"use client";

import { useRef } from "react";

import { MAP_CONFIG } from "../constants/map-config";

interface UseMapLongPressParams {
  onLongPress: (lng: number, lat: number) => void;
}

export function useMapLongPress({ onLongPress }: UseMapLongPressParams) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearPress() {
    if (!timerRef.current) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function startPress(lng: number, lat: number) {
    clearPress();

    timerRef.current = setTimeout(() => {
      onLongPress(lng, lat);
      timerRef.current = null;
    }, MAP_CONFIG.longPressMs);
  }

  return {
    startPress,
    clearPress,
  };
}
