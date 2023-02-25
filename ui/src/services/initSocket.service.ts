import { io } from "socket.io-client";
import * as msgpack from "socket.io-msgpack-parser";

export const initSocket = (uri: string, tokenPart: string | null) => {
  const tokenFull = "Bearer " + tokenPart;
  const socket = io(uri, {
    withCredentials: true,
    parser: msgpack,
    auth: {
      token: tokenFull,
    },
  });
  return socket;
};
