import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketManager } from "@/modules/realtime/managers/socket-manager";

export function useMapStoryRealtimeInvalidation() {
  const queryClient = useQueryClient();

  useEffect(() => {
    socketManager.mapStory.bindQueryClient(queryClient);
  }, [queryClient]);
}
