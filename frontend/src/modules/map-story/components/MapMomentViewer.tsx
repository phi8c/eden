"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { MapMomentGroup } from "../utils";

interface MapMomentViewerProps {
  group: MapMomentGroup | null;
  onClose: () => void;
}

export function MapMomentViewer({ group, onClose }: MapMomentViewerProps) {
  const [index, setIndex] = useState(0);
  const moments = group?.moments ?? [];
  const currentMoment = moments[index] ?? null;
  const media = currentMoment?.media[0] ?? null;

  useEffect(() => {
    setIndex(0);
  }, [group?.id]);

  if (!group || !currentMoment) {
    return null;
  }

  const canGoPrevious = index > 0;
  const canGoNext = index < moments.length - 1;

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/55 p-3 backdrop-blur-sm">
      <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">Moment {index + 1}/{moments.length}</p>
            <p className="text-xs text-muted-foreground">
              User {currentMoment.userId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Close moment viewer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative grid min-h-[320px] place-items-center bg-muted">
          {media?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.url}
              alt="Map moment"
              className="max-h-[60vh] w-full object-contain"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Khong co anh de hien thi.
            </p>
          )}

          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={!canGoPrevious}
            className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow disabled:opacity-35"
            aria-label="Previous moment"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setIndex((value) => Math.min(moments.length - 1, value + 1))
            }
            disabled={!canGoNext}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow disabled:opacity-35"
            aria-label="Next moment"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="flex gap-1 px-3 py-2">
          {moments.map((moment, itemIndex) => (
            <button
              key={moment.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 flex-1 rounded-full ${
                itemIndex === index ? "bg-primary" : "bg-muted"
              }`}
              aria-label={`Open moment ${itemIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
