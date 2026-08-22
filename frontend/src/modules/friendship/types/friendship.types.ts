import type { User } from "@/modules/user/types/user.types";

export enum FriendshipStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Blocked = 3,
}

export interface Friendship {
  id: number;
  user1_id: number;
  user2_id: number;
  requester_id: number;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export type SearchUser = Pick<User, "id" | "email"> & {
  username?: string;
};

export interface SendFriendRequestPayload {
  targetUserId: number;
}

export interface FriendshipRealtimeUpdate {
  action: "request" | "accepted" | "rejected" | "removed";
  friendship: Friendship;
  actorId: number;
  recipientUserIds: number[];
}
