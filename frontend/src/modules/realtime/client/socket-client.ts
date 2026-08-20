import { io, type Socket } from "socket.io-client";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socket-events.types";

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";

export function createChatSocket(token: string): ChatSocket {
  return io(`${SOCKET_BASE_URL}/chat`, {
    auth: {
      token,
    },
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    withCredentials: true,
  });
}
