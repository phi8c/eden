import { useQuery } from "@tanstack/react-query";

import { getMapMoments } from "../api";

export function useMapMoments(sessionId: number | null) {
  return useQuery({
    queryKey: ["map-story", "moments", sessionId],
    queryFn: () => getMapMoments(sessionId as number),
    enabled: Boolean(sessionId),
  });
}
