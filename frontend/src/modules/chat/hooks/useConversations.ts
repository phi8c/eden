"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveConversationId } from "@/store/slices/chatSlice";
import { getConversations } from "../api/chat.api";

export function useConversations() {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );

  const query = useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: getConversations,
  });

  useEffect(() => {
    if (
      !activeConversationId &&
      query.data &&
      query.data.length > 0
    ) {
      dispatch(setActiveConversationId(query.data[0].id));
    }
  }, [activeConversationId, dispatch, query.data]);

  return query;
}
