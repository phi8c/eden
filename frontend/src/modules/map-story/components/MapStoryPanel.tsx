"use client";

import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { Camera, MapPin, Navigation, Power, X } from "lucide-react";

import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { socketManager } from "@/modules/realtime/managers/socket-manager";
import {
  useMapLocationSharing,
  useMapMoments,
  useMapRealtime,
  useMapStoryRealtimeInvalidation,
  useMapSession,
  useMapSessionMutations,
  useUploadMapMoment,
} from "../hooks";

interface MapStoryPanelProps {
  conversationId: number;
}

const STATUS_LABEL: Record<number, string> = {
  0: "Cho dong y",
  1: "Dang chia se",
  2: "Da tu choi",
  3: "Da dung",
  4: "Het han",
};
const MAX_MOMENT_IMAGE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MOMENT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function MapStoryPanel({ conversationId }: MapStoryPanelProps) {
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sessionQuery = useMapSession(conversationId);
  const session = sessionQuery.data ?? null;
  const sessionId = session?.id ?? null;
  const mutations = useMapSessionMutations(conversationId);
  const momentsQuery = useMapMoments(sessionId);
  const uploadMoment = useUploadMapMoment(sessionId);
  const { error: locationError } = useMapLocationSharing(
    sessionId,
    sharingEnabled,
  );

  useMapRealtime(sessionId, session?.locations ?? []);
  useMapStoryRealtimeInvalidation();

  const isRecipient =
    Boolean(currentUserId && session?.requestedTo === currentUserId);
  const isPending = session?.status === 0;
  const isActive = session?.status === 1;

  const uploadMomentWithFreshLocation = (file: File) => {
    if (!sessionId) {
      setUploadError("Chua co session Map Story.");
      return;
    }

    if (!("geolocation" in navigator)) {
      setUploadError("Trinh duyet khong ho tro dinh vi, thu upload bang GPS gan nhat.");
      uploadMoment.mutate(file);
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

  return (
    <div className="z-20 border-b bg-background/95 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4" />
            Map Story
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {session
              ? `${STATUS_LABEL[session.status] ?? "Khong ro"} · Session #${session.id}`
              : "Chua co phien chia se vi tri cho hoi thoai nay."}
          </p>

          {locationError ? (
            <p className="mt-1 text-xs text-destructive">{locationError}</p>
          ) : null}

          {uploadError ? (
            <p className="mt-1 text-xs text-destructive">{uploadError}</p>
          ) : null}
        </div>

        {isPending && isRecipient ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => mutations.acceptRequest.mutate(session.id)}
              disabled={mutations.acceptRequest.isPending}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              <Navigation className="size-4" />
              Dong y
            </button>

            <button
              type="button"
              onClick={() => mutations.rejectRequest.mutate(session.id)}
              disabled={mutations.rejectRequest.isPending}
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium disabled:opacity-60"
            >
              <X className="size-4" />
              Tu choi
            </button>
          </div>
        ) : null}

        {session && (isPending || isActive) ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSharingEnabled((value) => !value)}
              className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                sharingEnabled
                  ? "bg-emerald-600 text-white"
                  : "border"
              }`}
            >
              <Navigation className="size-4" />
              GPS
            </button>

            {isActive ? (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      if (!ALLOWED_MOMENT_MIME_TYPES.has(file.type)) {
                        setUploadError("Chi ho tro anh jpeg, png hoac webp.");
                      } else if (file.size > MAX_MOMENT_IMAGE_BYTES) {
                        setUploadError("Anh Moment toi da 50MB.");
                      } else {
                        uploadMomentWithFreshLocation(file);
                      }
                    }
                    event.target.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploadMoment.isPending}
                  className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium disabled:opacity-60"
                >
                  <Camera className="size-4" />
                  Moment
                </button>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => mutations.endSession.mutate(session.id)}
              disabled={mutations.endSession.isPending}
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium disabled:opacity-60"
            >
              <Power className="size-4" />
              Dung
            </button>
          </div>
        ) : null}
      </div>

      {session ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {session.members.map((member) => (
            <span key={member.userId} className="rounded-md border px-2 py-1">
              User {member.userId}: {member.locationReady ? "da co GPS" : "cho GPS"}
            </span>
          ))}
          <span className="rounded-md border px-2 py-1">
            Moments: {momentsQuery.data?.length ?? 0}
          </span>
        </div>
      ) : null}
    </div>
  );
}
