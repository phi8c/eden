import {io, Socket} from "socket.io-client"
import type { ServerToClientEvents, ClientToServerEvents } from "../types/socket/server"
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  export const socket:Socket<
  ServerToClientEvents,
  ClientToServerEvents
  >=io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,

  withCredentials: true,


  })
