import { apiClient } from "@/lib/api/client";
import type {
  Conversation,
  ConversationType,
  Message,
  SendMessagePayload,
  Topic,
} from "../types/chat.types";

export async function getConversations() {
  const response = await apiClient.get<Conversation[]>("/conversations");
  return response.data;
}

export async function createConversation(payload: {
  type: ConversationType;
  memberIds: number[];
  title?: string;
}) {
  const response = await apiClient.post<Conversation>(
    "/conversations",
    payload,
  );

  return response.data;
}

export async function getTopics(conversationId: number) {
  const response = await apiClient.get<Topic[]>(
    `/topics/conversation/${conversationId}`,
  );
  return response.data;
}

export async function createTopic(payload: {
  conversationId: number;
  name: string;
}) {
  const response = await apiClient.post<Topic>("/topics", payload);
  return response.data;
}

export async function getMessages(topicId: number) {
  const response = await apiClient.get<Message[]>("/messages", {
    params: { topicId },
  });

  return response.data;
}

export async function sendMessage(payload: SendMessagePayload) {
  const response = await apiClient.post<Message>("/messages", payload);
  return response.data;
}
