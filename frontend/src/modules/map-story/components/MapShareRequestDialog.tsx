"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { MapPin, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAP_SHARE_DURATION_OPTIONS } from "../constants";
import { useMapSession, useMapSessionMutations } from "../hooks";
import type { MapShareDurationMinutes } from "../types";

interface MapShareRequestDialogProps {
  conversationId: number | null;
}

export function MapShareRequestDialog({
  conversationId,
}: MapShareRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState<MapShareDurationMinutes>(60);
  const sessionQuery = useMapSession(conversationId);
  const session = sessionQuery.data ?? null;
  const { createRequest } = useMapSessionMutations(conversationId);
  const disabled = !conversationId || Boolean(session);
  const requestError =
    createRequest.error instanceof AxiosError
      ? createRequest.error.response?.data?.message ?? createRequest.error.message
      : createRequest.error
        ? "Khong gui duoc request."
        : null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen(true)}
        title={
          session
            ? "Conversation nay da co phien Map Story"
            : "Gui yeu cau chia se vi tri"
        }
      >
        <MapPin data-icon="inline-start" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Chia se vi tri</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chon thoi gian de gui request cho doi phuong.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-md hover:bg-muted"
                aria-label="Close share request dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {MAP_SHARE_DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option.value)}
                  className={`h-10 rounded-md border text-sm font-medium ${
                    duration === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              type="button"
              className="mt-4 w-full"
              disabled={createRequest.isPending || !conversationId}
              onClick={() => {
                createRequest.mutate(duration, {
                  onSuccess: () => setOpen(false),
                });
              }}
            >
              <Send data-icon="inline-start" />
              Gui request
            </Button>

            {requestError ? (
              <p className="mt-3 text-xs text-destructive">
                {String(requestError)}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
