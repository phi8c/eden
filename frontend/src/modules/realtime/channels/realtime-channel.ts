import type { ChatSocket } from "../client/socket-client";

export interface RealtimeChannel {
  readonly name: string;
  register: (socket: ChatSocket) => void;
  unregister: (socket: ChatSocket) => void;
}
