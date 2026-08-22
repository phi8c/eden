"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMap, { Marker, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { Camera, Navigation } from "lucide-react";

import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { MapFocusOverlay } from "@/modules/chat-map/components/MapFocusOverlay";
import { useSharedFocusStore } from "@/modules/chat-map/stores/shared-focus.store";
import { MapMomentViewer } from "@/modules/map-story/components";
import { useMapMoments, useMapSession } from "@/modules/map-story/hooks";
import { useMapStoryStore } from "@/modules/map-story/stores";
import type { MapLocationState } from "@/modules/map-story/types";
import type { MapMomentGroup } from "@/modules/map-story/utils";
import { groupMapMoments } from "@/modules/map-story/utils";
import { MAP_CONFIG } from "../constants/map-config";
import { useMapLongPress } from "../hooks/useMapLongPress";
import { MapControls } from "./MapControls";

interface MapViewProps {
  conversationId: number;
}

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Nguồn ảnh vệ tinh free, không cần API key.
const SATELLITE_SOURCE_ID = "satellite-source";
const SATELLITE_LAYER_ID = "satellite-layer";
const SATELLITE_TILES = [
  "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
];

// Nguồn địa hình (DEM) free, không cần API key.
const TERRAIN_SOURCE_ID = "terrain-dem-source";
const HILLSHADE_LAYER_ID = "hillshade-layer";
const TERRAIN_TILES = [
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
];

type ViewMode = "street" | "satellite" | "terrain";
const EMPTY_LOCATIONS: Record<number, never> = {};
const LOCATION_FOCUS_ZOOM = 16;
const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  street: "Đường phố",
  satellite: "Vệ tinh",
  terrain: "Địa hình",
};
const VIEW_MODE_ORDER: ViewMode[] = ["street", "satellite", "terrain"];

interface OffscreenTarget {
  location: MapLocationState;
  rotation: number;
}

export function MapView({
  conversationId,
}: MapViewProps) {
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const setFocusPoint =
    useSharedFocusStore(
      (state) => state.setFocusPoint,
    );

  const mapRef = useRef<MapRef>(null);
  const fittedSessionRef = useRef<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("street");
  const [selectedMomentGroup, setSelectedMomentGroup] =
    useState<MapMomentGroup | null>(null);
  const [offscreenTarget, setOffscreenTarget] =
    useState<OffscreenTarget | null>(null);
  const sessionQuery = useMapSession(conversationId);
  const session = sessionQuery.data ?? null;
  const momentsQuery = useMapMoments(session?.id ?? null);
  const locationsBySession = useMapStoryStore(
    (state) => state.locationsBySession,
  );
  const realtimeLocations =
    session?.id
      ? locationsBySession[session.id] ?? EMPTY_LOCATIONS
      : EMPTY_LOCATIONS;
  const displayLocations = useMemo(() => {
    const locations = new Map<number, {
      userId: number;
      lat: number;
      lng: number;
      accuracy: number | null;
      updatedAt: string;
    }>();

    session?.locations?.forEach((location) => {
      locations.set(location.userId, location);
    });

    Object.values(realtimeLocations).forEach((location) => {
      locations.set(location.userId, location);
    });

    return [...locations.values()];
  }, [realtimeLocations, session?.locations]);
  const otherUserLocation =
    displayLocations.find((location) => location.userId !== currentUserId) ??
    null;
  const momentGroups = groupMapMoments(momentsQuery.data ?? []);
  const getMomentGroupClassName = (group: MapMomentGroup) => {
    const hasMine = group.moments.some(
      (moment) => moment.userId === currentUserId,
    );
    const hasOther = group.moments.some(
      (moment) => moment.userId !== currentUserId,
    );

    if (hasMine && hasOther) {
      return "bg-violet-600 text-white";
    }

    if (hasMine) {
      return "bg-emerald-600 text-white";
    }

    return "bg-sky-600 text-white";
  };

  const {
    startPress,
    clearPress,
  } = useMapLongPress({
    onLongPress: (lng, lat) => {
      console.log(
        "[MAP LONG PRESS]",
        {
          conversationId,
          lng,
          lat,
        },
      );

      setFocusPoint({
        conversationId,
        lng,
        lat,
        origin: "self",
        createdAt: Date.now(),
      });
    },
  });

  const clearSatellite = (map: maplibregl.Map) => {
    if (map.getLayer(SATELLITE_LAYER_ID)) map.removeLayer(SATELLITE_LAYER_ID);
    if (map.getSource(SATELLITE_SOURCE_ID)) map.removeSource(SATELLITE_SOURCE_ID);
  };

  const clearTerrain = (map: maplibregl.Map) => {
    map.setTerrain(null);
    if (map.getLayer(HILLSHADE_LAYER_ID)) map.removeLayer(HILLSHADE_LAYER_ID);
    if (map.getSource(TERRAIN_SOURCE_ID)) map.removeSource(TERRAIN_SOURCE_ID);
  };

  const focusLocation = useCallback((location: MapLocationState) => {
    mapRef.current?.flyTo({
      center: [location.lng, location.lat],
      zoom: LOCATION_FOCUS_ZOOM,
      duration: 700,
      essential: true,
    });
  }, []);

  const fitSharedLocations = useCallback(() => {
    const map = mapRef.current?.getMap();

    if (!map || displayLocations.length < 2) {
      return;
    }

    const key = displayLocations
      .map((location) => `${location.userId}:${location.lat}:${location.lng}`)
      .sort()
      .join("|");

    if (fittedSessionRef.current === key) {
      return;
    }

    const bounds = displayLocations.reduce(
      (nextBounds, location) =>
        nextBounds.extend([location.lng, location.lat]),
      new maplibregl.LngLatBounds(
        [displayLocations[0].lng, displayLocations[0].lat],
        [displayLocations[0].lng, displayLocations[0].lat],
      ),
    );

    map.fitBounds(bounds, {
      padding: 92,
      maxZoom: 15,
      duration: 800,
    });

    fittedSessionRef.current = key;
  }, [displayLocations]);

  const updateOffscreenTarget = useCallback(() => {
    const map = mapRef.current?.getMap();

    if (!map || !otherUserLocation) {
      setOffscreenTarget(null);
      return;
    }

    const bounds = map.getBounds();

    if (bounds.contains([otherUserLocation.lng, otherUserLocation.lat])) {
      setOffscreenTarget(null);
      return;
    }

    const centerPoint = map.project(map.getCenter());
    const targetPoint = map.project([
      otherUserLocation.lng,
      otherUserLocation.lat,
    ]);
    const rotation =
      Math.atan2(
        targetPoint.y - centerPoint.y,
        targetPoint.x - centerPoint.x,
      ) *
      (180 / Math.PI);

    setOffscreenTarget({
      location: otherUserLocation,
      rotation,
    });
  }, [otherUserLocation]);

  useEffect(() => {
    fitSharedLocations();
  }, [fitSharedLocations]);

  useEffect(() => {
    updateOffscreenTarget();
  }, [updateOffscreenTarget]);

  const applyViewMode = (mode: ViewMode) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Luôn dọn sạch trước khi áp mode mới, tránh chồng lớp cũ.
    clearSatellite(map);
    clearTerrain(map);

    if (mode === "satellite") {
      map.addSource(SATELLITE_SOURCE_ID, {
        type: "raster",
        tiles: SATELLITE_TILES,
        tileSize: 256,
        attribution:
          "© Esri, Maxar, Earthstar Geographics",
      });

      // Chèn layer vệ tinh ngay dưới layer symbol (tên đường/nhãn)
      // đầu tiên để giữ label hiển thị đè lên ảnh vệ tinh.
      const firstSymbolLayer = map
        .getStyle()
        .layers?.find((layer) => layer.type === "symbol");

      map.addLayer(
        {
          id: SATELLITE_LAYER_ID,
          type: "raster",
          source: SATELLITE_SOURCE_ID,
        },
        firstSymbolLayer?.id,
      );

      map.easeTo({ pitch: 0, duration: 400 });
    }

    if (mode === "terrain") {
      map.addSource(TERRAIN_SOURCE_ID, {
        type: "raster-dem",
        tiles: TERRAIN_TILES,
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 13,
        attribution:
          "<a href='https://github.com/tilezen/joerd/tree/master'>Joerd / AWS Open Data</a>",
      });

      map.setTerrain({
        source: TERRAIN_SOURCE_ID,
        exaggeration: 1.4,
      });

      map.addLayer({
        id: HILLSHADE_LAYER_ID,
        type: "hillshade",
        source: TERRAIN_SOURCE_ID,
        paint: {
          "hillshade-exaggeration": 0.4,
        },
      });

      // Nghiêng camera để cảm nhận địa hình 3D + nhà 3D
      // (building extrusion đã có sẵn trong style Liberty).
      map.easeTo({ pitch: 60, duration: 400 });
    }

    if (mode === "street") {
      map.easeTo({ pitch: 0, duration: 400 });
    }

    setViewMode(mode);
  };

  const cycleViewMode = () => {
    const currentIndex = VIEW_MODE_ORDER.indexOf(viewMode);
    const nextMode =
      VIEW_MODE_ORDER[(currentIndex + 1) % VIEW_MODE_ORDER.length];

    applyViewMode(nextMode);
  };

  return (
    <div
      className="
        relative
        h-full
        min-h-[500px]
        w-full
        overflow-hidden
      "
      style={{
        height: "500px",
      }}
    >
      <ReactMap
        ref={mapRef}
        initialViewState={{
          longitude:
            MAP_CONFIG.defaultLongitude,

          latitude:
            MAP_CONFIG.defaultLatitude,

          zoom:
            MAP_CONFIG.defaultZoom,
        }}

        minZoom={
          MAP_CONFIG.minZoom
        }

        maxZoom={
          MAP_CONFIG.maxZoom
        }

        mapStyle={
          MAP_STYLE
        }

        attributionControl={{
          customAttribution:
            "© OpenFreeMap © OpenMapTiles Data from OpenStreetMap",
        }}

        style={{
          width: "100%",
          height: "100%",
        }}

        onLoad={(event) => {
          const map = event.target;

          console.log("[MAP] LOADED");

          console.log(
            "[MAP] BEFORE TERRAIN",
            map.getTerrain(),
          );

          map.setTerrain(null);
          fitSharedLocations();
          updateOffscreenTarget();

          console.log(
            "[MAP] AFTER TERRAIN",
            map.getTerrain(),
          );
        }}

        onStyleData={(event) => {
          console.log(
            "[MAP STYLE DATA]",
            {
              dataType:
                event.dataType,
            },
          );
        }}

        onSourceData={(event) => {
          console.log(
            "[MAP SOURCE DATA]",
            {
              sourceId:
                event.sourceId,

              sourceDataType:
                event.sourceDataType,

              isSourceLoaded:
                event.isSourceLoaded,
            },
          );
        }}

        onData={(event) => {
          console.log(
            "[MAP DATA]",
            {
              dataType:
                event.dataType,
            },
          );
        }}

        onError={(event) => {
          console.error(
            "[MAP ERROR]",
            event.error,
          );
        }}

        onMouseDown={(event) => {
          console.log(
            "[MAP MOUSE DOWN]",
            {
              lng:
                event.lngLat.lng,

              lat:
                event.lngLat.lat,
            },
          );

          startPress(
            event.lngLat.lng,
            event.lngLat.lat,
          );
        }}

        onMouseUp={() => {
          clearPress();
        }}

        onMouseLeave={() => {
          clearPress();
        }}

        onTouchStart={(event) => {
          console.log(
            "[MAP TOUCH START]",
            {
              lng:
                event.lngLat.lng,

              lat:
                event.lngLat.lat,
            },
          );

          startPress(
            event.lngLat.lng,
            event.lngLat.lat,
          );
        }}

        onTouchEnd={() => {
          clearPress();
        }}

        onMoveEnd={() => {
          updateOffscreenTarget();
        }}
      >
        <MapControls />

        <MapFocusOverlay />

        {displayLocations.map((location) => (
          <Marker
            key={`map-location-${location.userId}`}
            latitude={location.lat}
            longitude={location.lng}
            anchor="bottom"
          >
            <button
              type="button"
              className={`rounded-full border-2 border-background px-2 py-1 text-xs font-semibold text-white shadow transition-transform hover:scale-105 ${
                location.userId === currentUserId
                  ? "bg-[var(--dove-status-green)]"
                  : "bg-[var(--dove-primary)]"
              }`}
              onClick={() => focusLocation(location)}
            >
              {location.userId === currentUserId ? "Ban" : "Doi phuong"}
            </button>
          </Marker>
        ))}

        {momentGroups.map((group) => (
          <Marker
            key={group.id}
            latitude={group.latitude}
            longitude={group.longitude}
            anchor="bottom"
          >
            <button
              type="button"
              onClick={() => setSelectedMomentGroup(group)}
              className={`relative grid size-10 place-items-center rounded-full border-2 border-background shadow transition-transform hover:scale-105 ${getMomentGroupClassName(group)}`}
              aria-label="Open map moments"
            >
              <Camera className="size-4" />
              {group.moments.length > 1 ? (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-background text-[10px] font-semibold text-foreground shadow">
                  {group.moments.length}
                </span>
              ) : null}
            </button>
          </Marker>
        ))}
      </ReactMap>

      {offscreenTarget ? (
        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-[var(--dove-primary)] text-white shadow-lg"
          aria-label="Focus other user location"
          onClick={() => focusLocation(offscreenTarget.location)}
        >
          <Navigation
            className="size-5"
            style={{
              transform: `rotate(${offscreenTarget.rotation + 90}deg)`,
            }}
          />
        </button>
      ) : null}

      <MapMomentViewer
        group={selectedMomentGroup}
        onClose={() => setSelectedMomentGroup(null)}
      />

      <div
        className="
          absolute
          right-3
          top-3
          z-10
          flex
          rounded-full
          border
          bg-background/90
          text-xs
          shadow-sm
          backdrop-blur
        "
      >
        <button
          type="button"
          onClick={cycleViewMode}
          className="rounded-full bg-[var(--dove-primary)] px-3 py-2 font-semibold text-white transition hover:bg-[var(--dove-primary)]"
        >
          {VIEW_MODE_LABELS[viewMode]}
        </button>
      </div>
    </div>
  );
}
