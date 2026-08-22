import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadMapMoment } from "../api";

export function useUploadMapMoment(sessionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMapMoment(sessionId as number, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["map-story", "moments", sessionId],
      });
    },
  });
}
