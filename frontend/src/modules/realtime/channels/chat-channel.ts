import type { Message } from "@/modules/chat/types/chat.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class ChatChannel implements RealtimeChannel {
  readonly name = "chat";
  private handlers = new Set<(message: Message) => void>();
  private readonly handleMessage = (message: Message) => {
    this.handlers.forEach((handler) => handler(message));
  };

  register(socket: ChatSocket) {
    socket.on("message:new", this.handleMessage);
  }

  unregister(socket: ChatSocket) {
    socket.off("message:new", this.handleMessage);
  }

  onMessage(handler: (message: Message) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }
}
