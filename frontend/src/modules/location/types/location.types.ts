export interface LocationPoint {
  lat: number;
  lng: number;
  accuracy?: number;
  updatedAt: number;
}

export interface LocationUpdateEvent {
  conversationId: number;
  userId: number;
  location: LocationPoint;
}
