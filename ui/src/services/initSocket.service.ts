import { io } from "socket.io-client";
import * as msgpack from "socket.io-msgpack-parser";
import { Cookie } from "../utils/auth-helper";

export const initSocket = (uri: string) => {
  const tokenPart = localStorage.getItem(Cookie.TOKEN);
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
