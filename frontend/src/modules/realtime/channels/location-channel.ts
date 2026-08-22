import type { LocationUpdateEvent } from "@/modules/location/types/location.types";
import type { MapLocationUpdatedEvent } from "@/modules/map-story/types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class LocationChannel implements RealtimeChannel {
  readonly name = "location";
  private socket: ChatSocket | null = null;
  private handlers = new Set<(event: LocationUpdateEvent) => void>();
  private mapHandlers = new Set<(event: MapLocationUpdatedEvent) => void>();
  private readonly handleLocation = (event: LocationUpdateEvent) => {
    this.handlers.forEach((handler) => handler(event));
  };
  private readonly handleMapLocation = (event: MapLocationUpdatedEvent) => {
    this.mapHandlers.forEach((handler) => handler(event));
  };

  register(socket: ChatSocket) {
    this.socket = socket;
    socket.on("location:update", this.handleLocation);
    socket.on("map.location.updated", this.handleMapLocation);
  }

  unregister(socket: ChatSocket) {
    socket.off("location:update", this.handleLocation);
    socket.off("map.location.updated", this.handleMapLocation);
    this.socket = null;
  }

  shareLocation(event: LocationUpdateEvent) {
    this.socket?.emit("location:share", event);
  }

  stopSharing(conversationId: number) {
    this.socket?.emit("location:stop", conversationId);
  }

  updateMapLocation(
    sessionId: number,
    location: {
      lat: number;
      lng: number;
      accuracy?: number | null;
    },
  ) {
    this.socket?.emit("map.location.update", {
      sessionId,
      location,
    });
  }

  updateMapLocationAsync(
    sessionId: number,
    location: {
      lat: number;
      lng: number;
      accuracy?: number | null;
    },
  ) {
    return new Promise<void>((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket chua ket noi."));
        return;
      }

      const timeout = window.setTimeout(() => {
        reject(new Error("Cap nhat GPS qua socket qua lau."));
      }, 8000);

      this.socket.emit(
        "map.location.update",
        {
          sessionId,
          location,
        },
        (response) => {
          window.clearTimeout(timeout);

          if (response?.success) {
            resolve();
            return;
          }

          reject(new Error("Khong cap nhat duoc GPS."));
        },
      );
    });
  }

  onLocation(handler: (event: LocationUpdateEvent) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  onMapLocation(handler: (event: MapLocationUpdatedEvent) => void) {
    this.mapHandlers.add(handler);

    return () => {
      this.mapHandlers.delete(handler);
    };
  }
}
