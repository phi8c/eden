export type MapLocationInput = {
  lat: number;
  lng: number;
  accuracy?: number | null;
};

export type MapLocationState = {
  userId: number;
  lat: number;
  lng: number;
  accuracy: number | null;
  updatedAt: string;
};

export type MapLocationUpdatePayload = {
  sessionId: number;
  conversationId: number;
  location: MapLocationState;
};
