import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { Message, MessageReactionUpdate } from "../types/chat.types";

type RawRealtimeMessage = Omit<
  Message,
  "id" | "conversationId" | "topicId" | "senderId" | "createdAt"
> & {
  id: number | string;
  conversationId: number | string;
  topicId: number | string;
  senderId: number | string;
  createdAt: string | Date;
};

export function normalizeMessage(message: RawRealtimeMessage): Message {
  return {
    id: Number(message.id),
    conversationId: Number(message.conversationId),
    topicId: Number(message.topicId),
    senderId: Number(message.senderId),
    content: message.content,
    type: Number(message.type),
    metadata: message.metadata ?? null,
    attachments: message.attachments ?? [],
    reactions: message.reactions ?? [],
    createdAt:
      message.createdAt instanceof Date
        ? message.createdAt.toISOString()
        : message.createdAt,
  };
}

export function updateMessageReactionsInQueryCache(
  queryClient: QueryClient,
  payload: MessageReactionUpdate,
) {
  queryClient.setQueriesData<Message[]>(
    {
      predicate: (query) =>
        isMessagesQueryForTopic(query.queryKey, Number(payload.topicId)),
    },
    (current = []) =>
      current.map((message) =>
        Number(message.id) === Number(payload.messageId)
          ? { ...message, reactions: payload.reactions ?? [] }
          : message,
      ),
  );
}

function isMessagesQueryForTopic(queryKey: QueryKey, topicId: number) {
  return (
    queryKey[0] === "chat" &&
    queryKey[1] === "messages" &&
    Number(queryKey[2]) === topicId
  );
}

export function appendMessageToQueryCache(
  queryClient: QueryClient,
  rawMessage: RawRealtimeMessage,
) {
  const message = normalizeMessage(rawMessage);
  let updatedExistingQuery = false;

  queryClient.setQueriesData<Message[]>(
    {
      predicate: (query) =>
        isMessagesQueryForTopic(query.queryKey, message.topicId),
    },
    (current = []) => {
      updatedExistingQuery = true;

      if (current.some((item) => Number(item.id) === message.id)) {
        return current;
      }

      return [...current, message];
    },
  );

  if (!updatedExistingQuery) {
    queryClient.setQueryData<Message[]>(
      ["chat", "messages", message.topicId],
      [message],
    );
  }

  return message;
}
