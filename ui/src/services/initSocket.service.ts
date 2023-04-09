import { io } from "socket.io-client";
import * as msgpack from "socket.io-msgpack-parser";

export const initSocket = (uri: string, tokenPart: string | null) => {
  const tokenFull = typeof tokenPart === "string" ? "Bearer " + tokenPart : "";
  const socket = io(uri, {
    autoConnect: false,
    parser: msgpack,
    auth: {
      token: tokenFull,
    },
  });
  return socket;
};

export const listenerWrapper = (callback: () => boolean) => {
  const interval: NodeJS.Timer = setInterval(() => {
    if (callback()) clearInterval(interval);
  }, 1000);
};
