import type {
  Message,
  MessageReactionUpdate,
} from "@/modules/chat/types/chat.types";
import type { SharedFocusPoint } from "@/modules/map/types/map.types";
import type { LocationUpdateEvent } from "@/modules/location/types/location.types";
import type {
  MapLocationUpdatedEvent,
} from "@/modules/map-story/types";
import type { FriendshipRealtimeUpdate } from "@/modules/friendship/types/friendship.types";

export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "message:reaction:updated": (payload: MessageReactionUpdate) => void;
  "message:typing:update": (payload: MessageTypingUpdate) => void;
  "friendship:updated": (payload: FriendshipRealtimeUpdate) => void;
  "presence:update": (payload: PresenceUpdateEvent) => void;
  "location:update": (payload: LocationUpdateEvent) => void;
  "map.location.updated": (payload: MapLocationUpdatedEvent) => void;
  "map.moment.created": (payload: {
    momentId: number;
    sessionId: number;
    conversationId: number;
    userId: number;
    recipientUserIds: number[];
    visibleUntil: string;
    mediaUrl: string | null;
  }) => void;
  "map.moment.expired": (payload: {
    momentId: number;
    sessionId: number;
    conversationId: number;
    userId: number;
    expiredAt: string;
  }) => void;
  "map.share.requested": (payload: unknown) => void;
  "map.share.accepted": (payload: unknown) => void;
  "map.share.rejected": (payload: unknown) => void;
  "map.session.started": (payload: unknown) => void;
  "map.session.ended": (payload: unknown) => void;
  "map.session.expired": (payload: unknown) => void;
  "notification.created": (payload: unknown) => void;
  "map:focus": (payload: SharedFocusPoint) => void;
}

export interface ClientToServerEvents {
  "conversation:join": (
    conversationId: number,
    ack?: (response: { success: boolean; conversationId: number }) => void,
  ) => void;
  "conversation:leave": (conversationId: number) => void;
  "message:typing:start": (payload: MessageTypingPayload) => void;
  "message:typing:stop": (payload: MessageTypingPayload) => void;
  "location:share": (payload: LocationUpdateEvent) => void;
  "map.location.update": (
    payload: {
      sessionId: number;
      location: {
        lat: number;
        lng: number;
        accuracy?: number | null;
      };
    },
    ack?: (response: { success: boolean; sessionId: number }) => void,
  ) => void;
  "location:stop": (conversationId: number) => void;
  "map:focus": (payload: SharedFocusPoint) => void;
}

export interface PresenceUpdateEvent {
  conversationId: number;
  userId: number;
  online: boolean;
  socketId?: string;
}

export interface MessageTypingPayload {
  conversationId: number;
  topicId: number;
}

export interface MessageTypingUpdate extends MessageTypingPayload {
  userId: number;
  typing: boolean;
  updatedAt: string;
}

export type SocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
