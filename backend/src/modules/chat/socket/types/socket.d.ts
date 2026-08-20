import 'socket.io';
import type { SocketData } from '../modules/chat/socket/types/socket-data.interface';

declare module 'socket.io' {
  interface Socket {
    data: SocketData;
  }
}