export const MapStoryRedisKeys = {
  location: (sessionId: number, userId: number) =>
    `map:session:${sessionId}:location:${userId}`,
} as const;
