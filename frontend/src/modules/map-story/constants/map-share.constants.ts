import type { MapShareDurationMinutes } from "../types";

export const MAP_SHARE_DURATION_OPTIONS: Array<{
  value: MapShareDurationMinutes;
  label: string;
}> = [
  { value: 60, label: "1 gio" },
  { value: 120, label: "2 gio" },
  { value: 360, label: "6 gio" },
];

export const MAX_MOMENT_IMAGE_BYTES = 50 * 1024 * 1024;

export const ALLOWED_MOMENT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
