import { useSocketStore } from "../stores/socket.store";
import { createChatSocket, type ChatSocket } from "../client/socket-client";
import { ChatChannel } from "../channels/chat-channel";
import { FriendshipChannel } from "../channels/friendship-channel";
import { LocationChannel } from "../channels/location-channel";
import { MapFocusChannel } from "../channels/map-focus-channel";
import { MapStoryChannel } from "../channels/map-story-channel";
import { PresenceChannel } from "../channels/presence-channel";
import type { RealtimeChannel } from "../channels/realtime-channel";

class SocketManager {
  private socket: ChatSocket | null = null;
  private token: string | null = null;
  private activeConversationId: number | null = null;
  readonly chat = new ChatChannel();
  readonly friendship = new FriendshipChannel();
  readonly presence = new PresenceChannel();
  readonly location = new LocationChannel();
  readonly mapFocus = new MapFocusChannel();
  readonly mapStory = new MapStoryChannel();
  private readonly channels: RealtimeChannel[] = [
    this.chat,
    this.friendship,
    this.presence,
    this.location,
    this.mapFocus,
    this.mapStory,
  ];

  connect(token: string) {
    if (this.socket?.connected && this.token === token) {
      return;
    }

    if (this.socket && !this.socket.connected && this.token === token) {
      useSocketStore.getState().setStatus("connecting");
      this.socket.connect();
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
    useSocketStore.getState().setJoinedConversationId(null);
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
      this.socket?.emit("conversation:join", conversationId, (response) => {
        if (response?.success) {
          useSocketStore
            .getState()
            .setJoinedConversationId(response.conversationId);
          useSocketStore.getState().setLastError(null);
          return;
        }

        useSocketStore
          .getState()
          .setLastError("Khong join duoc conversation socket.");
      });
    };

    if (this.socket?.connected) {
      join();
      return;
    }

    this.socket?.once("connect", join);
  }

  startTyping(payload: {
    conversationId: number;
    topicId: number;
  }) {
    this.socket?.emit("message:typing:start", payload);
  }

  stopTyping(payload: {
    conversationId: number;
    topicId: number;
  }) {
    this.socket?.emit("message:typing:stop", payload);
  }

  private leaveActiveConversation() {
    if (!this.activeConversationId) {
      return;
    }

    this.socket?.emit("conversation:leave", this.activeConversationId);
    this.activeConversationId = null;
    useSocketStore.getState().setActiveConversationId(null);
    useSocketStore.getState().setJoinedConversationId(null);
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
