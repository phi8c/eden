"use client";

import { useState, type FormEvent } from "react";
import { Hash, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTopic } from "../../hooks/useCreateTopic";

interface CreateTopicDialogProps {
  conversationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTopicDialog({
  conversationId,
  open,
  onOpenChange,
}: CreateTopicDialogProps) {
  const [name, setName] = useState("");
  const createTopic = useCreateTopic();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!conversationId || !trimmedName) {
      return;
    }

    try {
      await createTopic.mutateAsync({
        conversationId,
        name: trimmedName,
      });

      handleOpenChange(false);
    } catch {
      return;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 grid size-9 place-items-center rounded-lg bg-muted">
            <Hash className="size-4" />
          </div>
          <DialogTitle>Tao topic moi</DialogTitle>
          <DialogDescription>
            Moi conversation co the co nhieu topic, va moi topic se gom nhom
            tin nhan rieng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="topic-name">Ten topic</Label>
            <Input
              id="topic-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Vi du: General, Plan, Map..."
              autoFocus
              disabled={!conversationId || createTopic.isPending}
              required
            />
          </div>

          {!conversationId && (
            <p className="text-sm text-muted-foreground">
              Chon mot conversation truoc khi tao topic.
            </p>
          )}

          {createTopic.isError && (
            <p className="text-sm text-destructive">
              Khong tao duoc topic. Thu lai sau.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huy
            </Button>
            <Button
              type="submit"
              disabled={
                !conversationId ||
                !name.trim() ||
                createTopic.isPending
              }
            >
              {createTopic.isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Plus data-icon="inline-start" />
              )}
              Tao topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
