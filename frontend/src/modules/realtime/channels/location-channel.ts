import type { LocationUpdateEvent } from "@/modules/location/types/location.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class LocationChannel implements RealtimeChannel {
  readonly name = "location";
  private socket: ChatSocket | null = null;
  private handlers = new Set<(event: LocationUpdateEvent) => void>();
  private readonly handleLocation = (event: LocationUpdateEvent) => {
    this.handlers.forEach((handler) => handler(event));
  };

  register(socket: ChatSocket) {
    this.socket = socket;
    socket.on("location:update", this.handleLocation);
  }

  unregister(socket: ChatSocket) {
    socket.off("location:update", this.handleLocation);
    this.socket = null;
  }

  shareLocation(event: LocationUpdateEvent) {
    this.socket?.emit("location:share", event);
  }

  stopSharing(conversationId: number) {
    this.socket?.emit("location:stop", conversationId);
  }

  onLocation(handler: (event: LocationUpdateEvent) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
