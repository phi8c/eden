import { useState } from "react";
import { AxiosError } from "axios";

import { socketManager } from "@/modules/realtime/managers/socket-manager";
import {
  ALLOWED_MOMENT_MIME_TYPES,
  MAX_MOMENT_IMAGE_BYTES,
} from "../constants";
import type { MapShareDurationMinutes } from "../types";
import { getMapShareStatusText } from "../utils";
import { useMapLocationSharing } from "./useMapLocationSharing";
import { useMapSession } from "./useMapSession";
import { useMapSessionMutations } from "./useMapSessionMutations";
import { useMapStoryRealtimeInvalidation } from "./useMapStoryRealtimeInvalidation";
import { useUploadMapMoment } from "./useUploadMapMoment";

interface UseMapShareStatusControllerOptions {
  conversationId: number | null;
  currentUserId?: number | null;
}

export function useMapShareStatusController({
  conversationId,
  currentUserId,
}: UseMapShareStatusControllerOptions) {
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const sessionQuery = useMapSession(conversationId);
  const session = sessionQuery.data ?? null;
  const sessionId = session?.id ?? null;
  const mutations = useMapSessionMutations(conversationId);
  const uploadMoment = useUploadMapMoment(sessionId);
  const { error: locationError } = useMapLocationSharing(
    sessionId,
    sharingEnabled,
  );

  useMapStoryRealtimeInvalidation();

  const isPending = session?.status === 0 && !session.acceptedAt;
  const isActive = session?.status === 1 || Boolean(session?.acceptedAt);
  const isRecipient = Boolean(
    currentUserId && session?.requestedTo === currentUserId,
  );
  const canShowDecision = isPending && isRecipient;
  const statusText = getMapShareStatusText({ session, canShowDecision });

  const createRequest = (
    duration: MapShareDurationMinutes,
    onSuccess?: () => void,
  ) => {
    mutations.createRequest.mutate(duration, { onSuccess });
  };

  const acceptRequest = (onSuccess?: () => void) => {
    if (!session) {
      return;
    }

    mutations.acceptRequest.mutate(session.id, {
      onSuccess: () => {
        setSharingEnabled(true);
        onSuccess?.();
      },
    });
  };

  const rejectRequest = (onSuccess?: () => void) => {
    if (!session) {
      return;
    }

    mutations.rejectRequest.mutate(session.id, { onSuccess });
  };

  const endSession = () => {
    if (session) {
      mutations.endSession.mutate(session.id);
    }
  };

  const uploadMomentWithFreshLocation = (file: File) => {
    if (!sessionId) {
      setUploadError("Chua co session Map Story.");
      return;
    }

    if (!ALLOWED_MOMENT_MIME_TYPES.has(file.type)) {
      setUploadError("Chi ho tro anh jpeg, png hoac webp.");
      return;
    }

    if (file.size > MAX_MOMENT_IMAGE_BYTES) {
      setUploadError("Anh Moment toi da 50MB.");
      return;
    }

    const uploadWithCurrentLocation = () => {
      setUploadError(null);
      uploadMoment.mutate(file, {
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message ?? error.message
              : "Upload Moment that bai.";

          setUploadError(String(message));
        },
      });
    };

    if (!("geolocation" in navigator)) {
      setUploadError(
        "Trinh duyet khong ho tro dinh vi, thu upload bang GPS gan nhat.",
      );
      uploadWithCurrentLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await socketManager.location.updateMapLocationAsync(sessionId, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          uploadWithCurrentLocation();
        } catch (error) {
          setUploadError(
            error instanceof Error
              ? error.message
              : "Khong cap nhat duoc GPS truoc khi upload.",
          );
        }
      },
      (error) => {
        setUploadError(`${error.message}. Dang thu upload bang GPS gan nhat.`);
        uploadWithCurrentLocation();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 30000,
      },
    );
  };

  return {
    canShowDecision,
    createRequest,
    endSession,
    isActive,
    locationError,
    mutations,
    rejectRequest,
    acceptRequest,
    session,
    sharingEnabled,
    statusText,
    toggleSharing: () => setSharingEnabled((value) => !value),
    uploadError,
    uploadMoment,
    uploadMomentWithFreshLocation,
  };
}
