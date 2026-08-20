export interface MapPosition {
  lng: number;
  lat: number;
}

export interface SharedFocusPoint extends MapPosition {
  conversationId: number;
  origin: "self" | "remote";
  createdAt: number;
}

export interface PresenceMapUser {
  userId: number;
  name: string;
  avatarUrl?: string | null;
  online: boolean;
  position?: MapPosition | null;
}
