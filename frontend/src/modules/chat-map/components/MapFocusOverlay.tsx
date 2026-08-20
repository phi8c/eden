"use client";

import { Marker } from "react-map-gl/maplibre";

import { useSharedFocusStore } from "../stores/shared-focus.store";

export function MapFocusOverlay() {
  const focusPoint = useSharedFocusStore((state) => state.focusPoint);

  if (!focusPoint) {
    return null;
  }

  return (
    <Marker longitude={focusPoint.lng} latitude={focusPoint.lat}>
      <div className="relative grid size-10 place-items-center">
        <span className="absolute size-10 animate-ping rounded-full bg-teal-500/35" />
        <span className="relative size-3 rounded-full bg-teal-600 ring-4 ring-white" />
      </div>
    </Marker>
  );
}
