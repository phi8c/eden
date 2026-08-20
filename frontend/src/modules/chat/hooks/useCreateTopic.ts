"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "@/store/hooks";
import { setActiveTopicId } from "@/store/slices/chatSlice";
import { createTopic } from "../api/chat.api";

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: createTopic,
    onSuccess: (topic, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["chat", "topics", variables.conversationId],
      });

      dispatch(setActiveTopicId(topic.id));
    },
  });
}
