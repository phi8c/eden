import type { QueryClient } from "@tanstack/react-query";

import { useMapStoryStore } from "@/modules/map-story/stores";
import type { MapLocationUpdatedEvent } from "@/modules/map-story/types";
import type { ChatSocket } from "../client/socket-client";
import type { RealtimeChannel } from "./realtime-channel";

const MAP_STORY_EVENTS = [
  "map.share.requested",
  "map.share.accepted",
  "map.share.rejected",
  "map.session.started",
  "map.session.ended",
  "map.session.expired",
  "map.moment.created",
  "map.moment.expired",
] as const;

export class MapStoryChannel implements RealtimeChannel {
  readonly name = "map-story";
  private queryClient: QueryClient | null = null;
  private readonly handleLocation = (event: MapLocationUpdatedEvent) => {
    useMapStoryStore.getState().setLocation(event.sessionId, event.location);
  };
  private readonly handleMapStoryEvent = () => {
    this.queryClient?.invalidateQueries({
      queryKey: ["map-story"],
    });
  };

  bindQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  register(socket: ChatSocket) {
    socket.on("map.location.updated", this.handleLocation);
    MAP_STORY_EVENTS.forEach((event) => {
      socket.on(event, this.handleMapStoryEvent);
    });
  }

  unregister(socket: ChatSocket) {
    socket.off("map.location.updated", this.handleLocation);
    MAP_STORY_EVENTS.forEach((event) => {
      socket.off(event, this.handleMapStoryEvent);
    });
    this.queryClient = null;
  }
}
