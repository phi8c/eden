"use client";

import Map from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";

import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { MapFocusOverlay } from "@/modules/chat-map/components/MapFocusOverlay";
import { useSharedFocusStore } from "@/modules/chat-map/stores/shared-focus.store";
import { MAP_CONFIG } from "../constants/map-config";
import { useMapLongPress } from "../hooks/useMapLongPress";
import { MapAvatarMarker } from "./MapAvatarMarker";
import { MapControls } from "./MapControls";

interface MapViewProps {
  conversationId: number;
}

const openStreetMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export function MapView({ conversationId }: MapViewProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const setFocusPoint = useSharedFocusStore((state) => state.setFocusPoint);
  const { startPress, clearPress } = useMapLongPress({
    onLongPress: (lng, lat) => {
      setFocusPoint({
        conversationId,
        lng,
        lat,
        origin: "self",
        createdAt: Date.now(),
      });
    },
  });

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden">
      <Map
        initialViewState={{
          longitude: MAP_CONFIG.defaultLongitude,
          latitude: MAP_CONFIG.defaultLatitude,
          zoom: MAP_CONFIG.defaultZoom,
        }}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        mapStyle={openStreetMapStyle}
        attributionControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
        onMouseDown={(event) => {
          startPress(event.lngLat.lng, event.lngLat.lat);
        }}
        onMouseUp={clearPress}
        onMouseLeave={clearPress}
        onTouchStart={(event) => {
          startPress(event.lngLat.lng, event.lngLat.lat);
        }}
        onTouchEnd={clearPress}
      >
        <MapControls />
        <MapFocusOverlay />

        <MapAvatarMarker
          lat={MAP_CONFIG.defaultLatitude}
          lng={MAP_CONFIG.defaultLongitude}
          name={currentUser?.user.username ?? "You"}
          avatarUrl={currentUser?.profile?.avatarUrl}
          online
        />
      </Map>

      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur">
        <p className="font-medium">Conversation #{conversationId}</p>
        <p className="text-muted-foreground">Long press de danh dau vi tri</p>
      </div>
    </div>
  );
}
