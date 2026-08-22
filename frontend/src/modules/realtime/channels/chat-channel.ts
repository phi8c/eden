import type {
  Message,
  MessageReactionUpdate,
} from "@/modules/chat/types/chat.types";
import type { MessageTypingUpdate } from "../types/socket-events.types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

export class ChatChannel implements RealtimeChannel {
  readonly name = "chat";
  private handlers = new Set<(message: Message) => void>();
  private reactionHandlers = new Set<(payload: MessageReactionUpdate) => void>();
  private typingHandlers = new Set<(payload: MessageTypingUpdate) => void>();
  private readonly handleMessage = (message: Message) => {
    console.info("[socket] message:new", message);
    this.handlers.forEach((handler) => handler(message));
  };
  private readonly handleReaction = (payload: MessageReactionUpdate) => {
    console.info("[socket] message:reaction:updated", payload);
    this.reactionHandlers.forEach((handler) => handler(payload));
  };
  private readonly handleTyping = (payload: MessageTypingUpdate) => {
    this.typingHandlers.forEach((handler) => handler(payload));
  };

  register(socket: ChatSocket) {
    socket.on("message:new", this.handleMessage);
    socket.on("message:reaction:updated", this.handleReaction);
    socket.on("message:typing:update", this.handleTyping);
  }

  unregister(socket: ChatSocket) {
    socket.off("message:new", this.handleMessage);
    socket.off("message:reaction:updated", this.handleReaction);
    socket.off("message:typing:update", this.handleTyping);
  }

  onMessage(handler: (message: Message) => void) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  onReaction(handler: (payload: MessageReactionUpdate) => void) {
    this.reactionHandlers.add(handler);

    return () => {
      this.reactionHandlers.delete(handler);
    };
  }

  onTyping(handler: (payload: MessageTypingUpdate) => void) {
    this.typingHandlers.add(handler);

    return () => {
      this.typingHandlers.delete(handler);
    };
  }
}
