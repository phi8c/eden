"use client";

import { MapPinned } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div className="grid h-full min-h-[360px] place-items-center bg-[linear-gradient(135deg,#ecfeff,#f8fafc_45%,#eef2ff)] p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-teal-700 text-white shadow-sm">
          <MapPinned className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Chat map da co slot</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Phase 6 se gan MapLibre vao vung nay va dung conversation hien tai
          cho location sharing.
        </p>
      </div>
    </div>
  );
}
