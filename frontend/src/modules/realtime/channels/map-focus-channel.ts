import type { SharedFocusPoint } from "@/modules/map/types/map.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class MapFocusChannel implements RealtimeChannel {
  readonly name = "map-focus";
  private socket: ChatSocket | null = null;
  private handlers = new Set<(event: SharedFocusPoint) => void>();
  private readonly handleFocus = (event: SharedFocusPoint) => {
    this.handlers.forEach((handler) => handler(event));
  };

  register(socket: ChatSocket) {
    this.socket = socket;
    socket.on("map:focus", this.handleFocus);
  }

  unregister(socket: ChatSocket) {
    socket.off("map:focus", this.handleFocus);
    this.socket = null;
  }

  shareFocus(event: SharedFocusPoint) {
    this.socket?.emit("map:focus", event);
  }

  onFocus(handler: (event: SharedFocusPoint) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
