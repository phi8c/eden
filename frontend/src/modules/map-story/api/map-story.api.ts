import { apiClient } from "@/lib/api/client";
import type { MapMoment, MapShareDurationMinutes, MapShareSession } from "../types";

export async function getConversationMapSession(conversationId: number) {
  const response = await apiClient.get<MapShareSession | null>(
    `/conversations/${conversationId}/map-session`,
  );

  return response.data;
}

export async function createMapShareRequest(
  conversationId: number,
  durationMinutes: MapShareDurationMinutes,
) {
  const response = await apiClient.post<MapShareSession>(
    `/conversations/${conversationId}/map-share-requests`,
    { durationMinutes },
  );

  return response.data;
}

export async function acceptMapShareRequest(sessionId: number) {
  const response = await apiClient.post<MapShareSession>(
    `/map-sessions/${sessionId}/accept`,
  );

  return response.data;
}

export async function rejectMapShareRequest(sessionId: number) {
  const response = await apiClient.post<MapShareSession>(
    `/map-sessions/${sessionId}/reject`,
  );

  return response.data;
}

export async function endMapSession(sessionId: number) {
  const response = await apiClient.post<MapShareSession>(
    `/map-sessions/${sessionId}/end`,
  );

  return response.data;
}

export async function getMapMoments(sessionId: number) {
  const response = await apiClient.get<MapMoment[]>(
    `/map-sessions/${sessionId}/moments`,
  );

  return response.data;
}

export async function uploadMapMoment(sessionId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<MapMoment>(
    `/map-sessions/${sessionId}/moments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
