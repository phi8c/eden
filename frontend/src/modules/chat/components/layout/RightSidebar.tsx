"use client";

import { ShieldCheck } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { useSocketStore } from "@/modules/realtime/stores/socket.store";
import { FriendsPanel } from "@/modules/friendship/components/FriendsPanel";

export function RightSidebar() {
  const status = useSocketStore((state) => state.status);
  const socketId = useSocketStore((state) => state.socketId);
  const lastError = useSocketStore((state) => state.lastError);

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-background">
      <header className="flex h-14 shrink-0 items-center border-b px-4">
        <div>
          <p className="text-sm font-semibold">Details</p>
          <p className="text-xs text-muted-foreground">Thong tin hoi thoai</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        <section className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>MA</AvatarFallback>
              <AvatarBadge className="bg-emerald-500 ring-background" />
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Minh Anh</p>
              <p className="truncate text-xs text-muted-foreground">
                minhanh@example.com
              </p>
            </div>
          </div>
        </section>

        <FriendsPanel />

        <section className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-teal-700" />
            <div>
              <p className="text-sm font-medium">Realtime {status}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {socketId
                  ? `Socket ${socketId}`
                  : lastError ?? "Dang cho ket noi socket."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
