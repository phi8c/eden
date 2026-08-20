import type { PresenceUpdateEvent } from "../types/socket-events.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class PresenceChannel implements RealtimeChannel {
  readonly name = "presence";
  private handlers = new Set<(event: PresenceUpdateEvent) => void>();
  private readonly handlePresence = (event: PresenceUpdateEvent) => {
    this.handlers.forEach((handler) => handler(event));
  };

  register(socket: ChatSocket) {
    socket.on("presence:update", this.handlePresence);
  }

  unregister(socket: ChatSocket) {
    socket.off("presence:update", this.handlePresence);
  }

  onPresence(handler: (event: PresenceUpdateEvent) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
