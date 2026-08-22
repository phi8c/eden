"use client";

import { useState } from "react";
import { Check, Loader2, Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useUserSearch } from "../hooks/useUserSearch";
import { useSendFriendRequest } from "../hooks/useFriendshipMutations";

export function FriendSearch() {
  const [query, setQuery] = useState("");
  const [requestedUserIds, setRequestedUserIds] = useState<number[]>([]);
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const { data: users = [], isFetching } = useUserSearch(query);
  const sendRequest = useSendFriendRequest();
  const visibleUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <section className="grid gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-8"
          placeholder="Tim user bang email"
        />
      </div>

      {query.trim().length > 1 && (
        <div className="grid gap-1 rounded-lg border bg-background p-1">
          {isFetching && (
            <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Dang tim
            </div>
          )}

          {!isFetching && visibleUsers.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              Khong tim thay user.
            </p>
          )}

          {!isFetching &&
            visibleUsers.map((user) => {
              const requested = requestedUserIds.includes(user.id);
              const sending =
                sendRequest.isPending &&
                sendRequest.variables?.targetUserId === user.id;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {user.username ?? `User ${user.id}`}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={requested ? "secondary" : "outline"}
                    size="sm"
                    onClick={() =>
                      sendRequest.mutate(
                        {
                          targetUserId: user.id,
                        },
                        {
                          onSuccess: () =>
                            setRequestedUserIds((current) =>
                              current.includes(user.id)
                                ? current
                                : [...current, user.id],
                            ),
                        },
                      )
                    }
                    disabled={requested || sending}
                  >
                    {requested ? (
                      <Check data-icon="inline-start" />
                    ) : sending ? (
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                    ) : (
                      <UserPlus data-icon="inline-start" />
                    )}
                    {requested ? "Da gui" : sending ? "Dang gui" : "Add"}
                  </Button>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
