import type { Message } from "@/modules/chat/types/chat.types";
import type { SharedFocusPoint } from "@/modules/map/types/map.types";
import type { LocationUpdateEvent } from "@/modules/location/types/location.types";

export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "presence:update": (payload: PresenceUpdateEvent) => void;
  "location:update": (payload: LocationUpdateEvent) => void;
  "map:focus": (payload: SharedFocusPoint) => void;
}

export interface ClientToServerEvents {
  "conversation:join": (
    conversationId: number,
    ack?: (response: { success: boolean; conversationId: number }) => void,
  ) => void;
  "conversation:leave": (conversationId: number) => void;
  "location:share": (payload: LocationUpdateEvent) => void;
  "location:stop": (conversationId: number) => void;
  "map:focus": (payload: SharedFocusPoint) => void;
}

export interface PresenceUpdateEvent {
  conversationId: number;
  userId: number;
  online: boolean;
  socketId?: string;
}

export type SocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
