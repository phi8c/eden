"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveTopicId } from "@/store/slices/chatSlice";
import { getTopics } from "../api/chat.api";

export function useTopics(conversationId: number | null) {
  const dispatch = useAppDispatch();
  const activeTopicId = useAppSelector((state) => state.chat.activeTopicId);

  const query = useQuery({
    queryKey: ["chat", "topics", conversationId],
    queryFn: () => getTopics(conversationId as number),
    enabled: Boolean(conversationId),
  });

  useEffect(() => {
    if (!conversationId || activeTopicId || !query.data?.length) {
      return;
    }

    dispatch(setActiveTopicId(query.data[0].id));
  }, [activeTopicId, conversationId, dispatch, query.data]);

  return query;
}
