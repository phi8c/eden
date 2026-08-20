import { useSocketStore } from "../stores/socket.store";
import { createChatSocket, type ChatSocket } from "../client/socket-client";
import { ChatChannel } from "../channels/chat-channel";
import { LocationChannel } from "../channels/location-channel";
import { MapFocusChannel } from "../channels/map-focus-channel";
import { PresenceChannel } from "../channels/presence-channel";
import type { RealtimeChannel } from "../channels/realtime-channel";

class SocketManager {
  private socket: ChatSocket | null = null;
  private token: string | null = null;
  private activeConversationId: number | null = null;
  readonly chat = new ChatChannel();
  readonly presence = new PresenceChannel();
  readonly location = new LocationChannel();
  readonly mapFocus = new MapFocusChannel();
  private readonly channels: RealtimeChannel[] = [
    this.chat,
    this.presence,
    this.location,
    this.mapFocus,
  ];

  connect(token: string) {
    if (this.socket?.connected && this.token === token) {
      return;
    }

    if (this.socket && this.token !== token) {
      this.disconnect();
    }

    this.token = token;
    this.socket = createChatSocket(token);
    this.registerCoreHandlers(this.socket);
    this.registerChannels(this.socket);

    useSocketStore.getState().setStatus("connecting");
    this.socket.connect();
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.leaveActiveConversation();
    this.unregisterChannels(this.socket);
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
    this.token = null;

    useSocketStore.getState().setStatus("disconnected");
    useSocketStore.getState().setSocketId(null);
  }

  updateToken(token: string | null) {
    if (!token) {
      this.disconnect();
      return;
    }

    if (this.token !== token) {
      this.connect(token);
    }
  }

  joinConversation(conversationId: number | null) {
    if (!conversationId) {
      this.leaveActiveConversation();
      return;
    }

    if (this.activeConversationId === conversationId) {
      return;
    }

    this.leaveActiveConversation();
    this.activeConversationId = conversationId;
    useSocketStore.getState().setActiveConversationId(conversationId);

    const join = () => {
      this.socket?.emit("conversation:join", conversationId);
    };

    if (this.socket?.connected) {
      join();
      return;
    }

    this.socket?.once("connect", join);
  }

  private leaveActiveConversation() {
    if (!this.activeConversationId) {
      return;
    }

    this.socket?.emit("conversation:leave", this.activeConversationId);
    this.activeConversationId = null;
    useSocketStore.getState().setActiveConversationId(null);
  }

  private registerCoreHandlers(socket: ChatSocket) {
    socket.on("connect", () => {
      useSocketStore.getState().setStatus("connected");
      useSocketStore.getState().setSocketId(socket.id ?? null);
      useSocketStore.getState().setLastError(null);

      if (this.activeConversationId) {
        socket.emit("conversation:join", this.activeConversationId);
      }
    });

    socket.on("disconnect", () => {
      useSocketStore.getState().setStatus("disconnected");
      useSocketStore.getState().setSocketId(null);
    });

    socket.on("connect_error", (error) => {
      useSocketStore.getState().setStatus("error");
      useSocketStore.getState().setLastError(error.message);
    });

  }

  private registerChannels(socket: ChatSocket) {
    this.channels.forEach((channel) => channel.register(socket));
  }

  private unregisterChannels(socket: ChatSocket) {
    this.channels.forEach((channel) => channel.unregister(socket));
  }
}

export const socketManager = new SocketManager();
