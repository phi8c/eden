"use client";

import dynamic from "next/dynamic";
import { Loader2, MapPinned } from "lucide-react";

const MapView = dynamic(
  () => import("@/modules/map/components/MapView").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Dang tai ban do
      </div>
    ),
  },
);

interface ChatMapModeProps {
  conversationId: number | null;
}

export function ChatMapMode({ conversationId }: ChatMapModeProps) {
  if (!conversationId) {
    return (
      <div className="grid h-full min-h-[360px] place-items-center p-6 text-center text-sm text-muted-foreground">
        <div>
          <MapPinned className="mx-auto mb-3 size-8" />
          Chon mot hoi thoai de mo chat map.
        </div>
      </div>
    );
  }

  return <MapView conversationId={conversationId} />;
}
