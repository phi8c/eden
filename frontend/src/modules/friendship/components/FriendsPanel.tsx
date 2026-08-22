"use client";

import { useEffect } from "react";
import { Check, Loader2, MessageCircle, UserMinus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { setActiveConversationId } from "@/store/slices/chatSlice";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useChatUiStore } from "@/modules/chat/stores/chat-ui.store";
import { useConversations } from "@/modules/chat/hooks/useConversations";
import type { Conversation } from "@/modules/chat/types/chat.types";
import { useFriends } from "../hooks/useFriends";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useUnfriend,
} from "../hooks/useFriendshipMutations";
import { usePendingRequests } from "../hooks/usePendingRequests";
import type { Friendship } from "../types/friendship.types";

function getOtherUserId(friendship: Friendship, currentUserId?: number) {
  if (!currentUserId) {
    return null;
  }

  return Number(friendship.user1_id) === Number(currentUserId)
    ? friendship.user2_id
    : friendship.user1_id;
}

function findPrivateConversation(
  conversations: Conversation[],
  currentUserId: number | undefined,
  otherUserId: number,
) {
  return conversations.find((conversation) => {
    const isPrivate =
      conversation.type === "private" ||
      (conversation.type as unknown as number) === 0;

    if (!isPrivate || !currentUserId) {
      return false;
    }

    const memberIds = conversation.members.map((member) =>
      Number(member.user_id),
    );

    return memberIds.includes(currentUserId) && memberIds.includes(otherUserId);
  });
}

export function FriendsPanel() {
  const dispatch = useAppDispatch();
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const setMobilePanel = useChatUiStore((state) => state.setMobilePanel);
  const conversationsQuery = useConversations();
  const friendsQuery = useFriends();
  const pendingQuery = usePendingRequests();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const unfriend = useUnfriend();

  useEffect(() => {
    if (friendsQuery.isSuccess) {
      void conversationsQuery.refetch();
    }
  }, [conversationsQuery.refetch, friendsQuery.isSuccess]);

  async function handleStartChat(friendship: Friendship) {
    const otherUserId = getOtherUserId(friendship, currentUserId);

    if (!otherUserId) {
      return;
    }

    const cachedConversation = findPrivateConversation(
      conversationsQuery.data ?? [],
      currentUserId,
      otherUserId,
    );
    const conversation =
      cachedConversation ??
      findPrivateConversation(
        (await conversationsQuery.refetch()).data ?? [],
        currentUserId,
        otherUserId,
      );

    if (!conversation) {
      return;
    }

    dispatch(setActiveConversationId(conversation.id));
    setMobilePanel("chat");
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Loi moi</p>
            <p className="text-xs text-muted-foreground">Dang cho xu ly</p>
          </div>
          {pendingQuery.isFetching && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="grid gap-2">
          {(pendingQuery.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Khong co loi moi.</p>
          )}

          {(pendingQuery.data ?? []).map((request) => (
            <div key={request.id} className="rounded-md bg-muted/50 p-2">
              <p className="text-sm font-medium">
                User {getOtherUserId(request, currentUserId)}
              </p>
              <p className="text-xs text-muted-foreground">
                Friendship #{request.id}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => acceptRequest.mutate(request.id)}
                  disabled={acceptRequest.isPending}
                >
                  <Check data-icon="inline-start" />
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => rejectRequest.mutate(request.id)}
                  disabled={rejectRequest.isPending}
                >
                  <X data-icon="inline-start" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Ban be</p>
            <p className="text-xs text-muted-foreground">Co the bat dau chat</p>
          </div>
          {friendsQuery.isFetching && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="grid gap-2">
          {(friendsQuery.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Chua co ban be.</p>
          )}

          {(friendsQuery.data ?? []).map((friendship) => (
            <div
              key={friendship.id}
              className="flex items-center justify-between gap-2 rounded-md bg-muted/50 p-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  User {getOtherUserId(friendship, currentUserId)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Friendship #{friendship.id}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Start chat"
                  onClick={() => void handleStartChat(friendship)}
                  disabled={conversationsQuery.isFetching}
                >
                  <MessageCircle />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Unfriend"
                  onClick={() => unfriend.mutate(friendship.id)}
                  disabled={unfriend.isPending}
                >
                  <UserMinus />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
