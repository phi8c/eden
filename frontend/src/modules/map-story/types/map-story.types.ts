export type MapShareSessionStatus = 0 | 1 | 2 | 3 | 4;
export type MapShareDurationMinutes = 60 | 120 | 360;

export interface MapSessionMember {
  userId: number;
  locationReady: boolean;
  joinedAt: string | null;
  lastLocationAt: string | null;
}

export interface MapShareSession {
  id: number;
  conversationId: number;
  requestedBy: number;
  requestedTo: number;
  durationMinutes: MapShareDurationMinutes;
  status: MapShareSessionStatus;
  requestedAt: string;
  acceptedAt: string | null;
  startedAt: string | null;
  expiresAt: string | null;
  endedAt: string | null;
  endedBy: number | null;
  endReason: number | null;
  members: MapSessionMember[];
  locations?: MapLocationState[];
}

export interface MapMomentMedia {
  id: number;
  storageAssetId: number;
  sortOrder: number;
  url: string | null;
  mimeType: string | null;
  providerFileId: string | null;
}

export interface MapMoment {
  id: number;
  sessionId: number;
  conversationId: number;
  userId: number;
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
  createdAt: string;
  visibleUntil: string;
  media: MapMomentMedia[];
}

export interface MapLocationState {
  userId: number;
  lat: number;
  lng: number;
  accuracy: number | null;
  updatedAt: string;
}

export interface MapLocationUpdatedEvent {
  sessionId: number;
  conversationId: number;
  location: MapLocationState;
}
