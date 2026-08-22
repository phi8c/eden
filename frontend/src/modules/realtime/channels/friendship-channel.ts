import type { FriendshipRealtimeUpdate } from "@/modules/friendship/types/friendship.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class FriendshipChannel implements RealtimeChannel {
  readonly name = "friendship";
  private handlers = new Set<(payload: FriendshipRealtimeUpdate) => void>();
  private readonly handleUpdate = (payload: FriendshipRealtimeUpdate) => {
    this.handlers.forEach((handler) => handler(payload));
  };

  register(socket: ChatSocket) {
    socket.on("friendship:updated", this.handleUpdate);
  }

  unregister(socket: ChatSocket) {
    socket.off("friendship:updated", this.handleUpdate);
  }

  onUpdate(handler: (payload: FriendshipRealtimeUpdate) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
