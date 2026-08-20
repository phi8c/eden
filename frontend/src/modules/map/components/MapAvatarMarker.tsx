"use client";

import { Marker } from "react-map-gl/maplibre";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MapAvatarMarkerProps {
  lat: number;
  lng: number;
  name: string;
  avatarUrl?: string | null;
  online?: boolean;
}

export function MapAvatarMarker({
  lat,
  lng,
  name,
  avatarUrl,
  online = true,
}: MapAvatarMarkerProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Marker longitude={lng} latitude={lat}>
      <Avatar size="lg" className="shadow-lg ring-2 ring-background">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
        {online && <AvatarBadge className="bg-emerald-500 ring-background" />}
      </Avatar>
    </Marker>
  );
}
