"use client";

import { useRouter } from "next/navigation";
import { LogOut, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/useLogout";
import { useAuthStore } from "../stores/auth.store";

export function ChatPhaseOneShell() {
  const router = useRouter();
  const logoutMutation = useLogout();
  const currentUser = useAuthStore((state) => state.currentUser);

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    router.replace("/login");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-muted/40 px-6">
      <section className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageCircle className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Chat app da vao duoc
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Phase 1 da noi auth/session. Phase 2 se thay man hinh nay bang
              layout chat day du.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut data-icon="inline-start" />
            Dang xuat
          </Button>
        </div>

        <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-sm">
          <p className="font-medium">
            {currentUser?.user.username ?? "Nguoi dung"}
          </p>
          <p className="mt-1 text-muted-foreground">
            {currentUser?.user.email ?? "Dang tai profile..."}
          </p>
        </div>
      </section>
    </main>
  );
}
