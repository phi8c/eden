import type { Conversation } from "../types/chat.types";

export function getConversationDisplay(
  conversation: Conversation,
  currentUserId?: number | null,
) {
  const isPrivateConversation =
    conversation.type === "private" ||
    (conversation.type as unknown as number) === 0;
  const normalizedCurrentUserId =
    currentUserId == null ? null : Number(currentUserId);
  const otherMember =
    conversation.members.find(
      (member) => Number(member.user_id) !== normalizedCurrentUserId,
    ) ??
    conversation.members[0] ??
    null;
  const memberDisplayName =
    otherMember?.profile?.displayName ??
    otherMember?.user?.username ??
    (otherMember ? `User ${otherMember.user_id}` : null);
  const displayName =
    isPrivateConversation
      ? memberDisplayName ?? `Conversation ${conversation.id}`
      : conversation.title ?? memberDisplayName ?? `Conversation ${conversation.id}`;
  const subtitle =
    conversation.lastMessage ??
    otherMember?.user?.email ??
    "Chua co tin nhan";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    otherMember,
    displayName,
    subtitle,
    initials: initials || "?",
  };
}
