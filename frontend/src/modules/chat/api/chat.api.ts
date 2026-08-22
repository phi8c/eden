import { apiClient } from "@/lib/api/client";
import type {
  Conversation,
  ConversationType,
  Message,
  MessageReactionUpdate,
  SendMessagePayload,
  Topic,
} from "../types/chat.types";

export async function getConversations() {
  const response = await apiClient.get<Conversation[]>("/conversations");
  return response.data;
}

export async function toggleMessageReaction(payload: {
  messageId: number;
  reaction: string;
}) {
  const response = await apiClient.post<MessageReactionUpdate>(
    `/messages/${payload.messageId}/reactions`,
    { reaction: payload.reaction },
  );

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

function normalizeMessageFiles(files: SendMessagePayload["files"]) {
  if (!files) {
    return [];
  }

  if (files instanceof File) {
    return [files];
  }

  if (Array.isArray(files)) {
    return files;
  }

  return Array.from(files as unknown as FileList);
}

export async function sendMessage(payload: SendMessagePayload) {
  const files = normalizeMessageFiles(payload.files);

  if (files.length > 0) {
    const formData = new FormData();
    formData.append("conversationId", String(payload.conversationId));
    formData.append("topicId", String(payload.topicId));

    if (payload.content) {
      formData.append("content", payload.content);
    }

    if (payload.type) {
      formData.append("type", String(payload.type));
    }

    if (payload.metadata) {
      formData.append("metadata", JSON.stringify(payload.metadata));
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post<Message>("/messages", formData);

    return response.data;
  }

  const { files: _files, ...jsonPayload } = payload;
  const response = await apiClient.post<Message>("/messages", jsonPayload);
  return response.data;
}
