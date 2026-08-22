"use client";

import { useRef, useState } from "react";
import {
  Camera,
  Clock,
  MapPin,
  Navigation,
  Power,
  Send,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MAP_SHARE_DURATION_OPTIONS } from "../constants";
import { useMapShareStatusController } from "../hooks";
import type { MapShareDurationMinutes } from "../types";

interface MapShareStatusBarProps {
  conversationId: number | null;
  currentUserId?: number | null;
}

export function MapShareStatusBar({
  conversationId,
  currentUserId,
}: MapShareStatusBarProps) {
  const [requestOpen, setRequestOpen] = useState(false);
  const [duration, setDuration] = useState<MapShareDurationMinutes>(60);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const controller = useMapShareStatusController({
    conversationId,
    currentUserId,
  });
  const {
    acceptRequest,
    canShowDecision,
    createRequest,
    endSession,
    isActive,
    locationError,
    mutations,
    rejectRequest,
    session,
    sharingEnabled,
    statusText,
    toggleSharing,
    uploadError,
    uploadMoment,
    uploadMomentWithFreshLocation,
  } = controller;
  const shareButtonLabel = isActive
    ? statusText
    : canShowDecision
      ? "Yeu cau vi tri"
      : session
        ? "Dang cho"
        : "Chia se";

  return (
    <div className="min-w-0 flex-1">
      <div className="flex h-10 items-center gap-1.5">
        <div
          className={cn(
            "relative min-w-0",
            canShowDecision ? "flex-1" : "w-[88px]",
            isActive && "w-[74px]",
          )}
        >
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold transition",
              isActive
                ? "bg-[var(--dove-primary)] text-white"
                : "bg-[var(--dove-cream)] text-[var(--dove-primary)]",
            )}
            disabled={!conversationId || (!canShowDecision && Boolean(session))}
            onClick={() => {
              if (canShowDecision) {
                setDecisionOpen((open) => !open);
                return;
              }
              setRequestOpen(true);
            }}
          >
            {isActive ? (
              <Clock className="size-4" />
            ) : (
              <MapPin className="size-4" />
            )}
            <span className="truncate">{shareButtonLabel}</span>
          </button>

          {decisionOpen && canShowDecision ? (
            <div className="absolute left-0 right-0 top-12 z-50 grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-[#F1DDCF]">
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--dove-primary)] text-sm font-semibold text-white"
                disabled={mutations.acceptRequest.isPending}
                onClick={() => acceptRequest(() => setDecisionOpen(false))}
              >
                <Navigation className="size-4" />
                Dong y
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FFF1F0] text-sm font-semibold text-[var(--dove-badge-red)]"
                disabled={mutations.rejectRequest.isPending}
                onClick={() => rejectRequest(() => setDecisionOpen(false))}
              >
                <X className="size-4" />
                Tu choi
              </button>
            </div>
          ) : null}
        </div>

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
                  uploadMomentWithFreshLocation(file);
                }
                event.target.value = "";
              }}
            />
            <button
              type="button"
              aria-label="Upload moment"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--dove-primary)] shadow-sm ring-1 ring-[#F1DDCF]"
              disabled={uploadMoment.isPending}
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="size-4" />
            </button>
          </>
        ) : null}

        {session ? (
          <>
            <button
              type="button"
              aria-label="Toggle location"
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full shadow-sm ring-1 ring-[#F1DDCF]",
                sharingEnabled
                  ? "bg-[var(--dove-status-green)] text-white"
                  : "bg-white text-[var(--dove-primary)]",
              )}
              onClick={toggleSharing}
            >
              <Navigation className="size-4" />
            </button>
          </>
        ) : null}

        {isActive ? (
          <>
            <button
              type="button"
              aria-label="End sharing"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--dove-badge-red)] shadow-sm ring-1 ring-[#F1DDCF]"
              disabled={mutations.endSession.isPending}
              onClick={endSession}
            >
              <Power className="size-4" />
            </button>
          </>
        ) : null}
      </div>

      {requestOpen ? (
        <div className="mt-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#F1DDCF]">
          <div className="grid grid-cols-3 gap-2">
            {MAP_SHARE_DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "h-9 rounded-xl text-sm font-semibold",
                  duration === option.value
                    ? "bg-[var(--dove-primary)] text-white"
                    : "bg-[var(--dove-cream)] text-[var(--dove-primary)]",
                )}
                onClick={() => setDuration(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="h-9 rounded-xl bg-[var(--dove-primary)] text-sm font-semibold text-white disabled:opacity-60"
              disabled={mutations.createRequest.isPending || !conversationId}
              onClick={() =>
                createRequest(duration, () => setRequestOpen(false))
              }
            >
              <Send className="mr-1 inline size-4" />
              Gui
            </button>
            <button
              type="button"
              className="h-9 rounded-xl bg-[#FAFAFA] text-sm font-semibold text-[var(--dove-text-dark)]"
              onClick={() => setRequestOpen(false)}
            >
              Huy
            </button>
          </div>
        </div>
      ) : null}

      {locationError || uploadError ? (
        <p className="mt-2 text-xs text-[var(--dove-badge-red)]">
          {locationError ?? uploadError}
        </p>
      ) : null}
    </div>
  );
}
