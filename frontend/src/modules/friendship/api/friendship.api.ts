import { apiClient } from "@/lib/api/client";
import type {
  Friendship,
  SearchUser,
  SendFriendRequestPayload,
} from "../types/friendship.types";

export async function searchUsers(q: string) {
  const response = await apiClient.get<SearchUser[]>("/users/search", {
    params: { q },
  });

  return response.data;
}

export async function sendFriendRequest(payload: SendFriendRequestPayload) {
  const response = await apiClient.post<Friendship>(
    "/friends/request",
    payload,
  );

  return response.data;
}

export async function getFriends() {
  const response = await apiClient.get<Friendship[]>("/friends");
  return response.data;
}

export async function getPendingRequests() {
  const response = await apiClient.get<Friendship[]>("/friends/pending");
  return response.data;
}

export async function acceptFriendRequest(id: number) {
  const response = await apiClient.post(`/friends/${id}/accept`);
  return response.data;
}

export async function rejectFriendRequest(id: number) {
  const response = await apiClient.post(`/friends/${id}/reject`);
  return response.data;
}

export async function unfriend(id: number) {
  const response = await apiClient.delete(`/friends/${id}`);
  return response.data;
}
