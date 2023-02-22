import { io, Socket } from "socket.io-client";
import * as msgpack from "socket.io-msgpack-parser";

export const initSocket = (uri: string) => {
  const socket = io(uri, {
    withCredentials: true,
    parser: msgpack,
  });
  socket
  return socket;
};
