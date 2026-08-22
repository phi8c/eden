import type { Friendship } from '../entities/friendship.entity';

export type FriendshipRealtimeAction =
  | 'request'
  | 'accepted'
  | 'rejected'
  | 'removed';

export interface FriendshipUpdatedPayload {
  action: FriendshipRealtimeAction;
  friendship: Friendship;
  actorId: number;
  recipientUserIds: number[];
}

export class FriendshipUpdatedEvent {
  constructor(
    public readonly payload: FriendshipUpdatedPayload,
  ) {}
}
