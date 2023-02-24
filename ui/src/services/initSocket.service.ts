import { io, Socket } from "socket.io-client";
import * as msgpack from "socket.io-msgpack-parser";
import { Cookie } from "../utils/auth-helper";

export const initSocket = (uri: string) => {
  const token = "Bearer " + localStorage.getItem(Cookie.TOKEN);
  const socket = io(uri, {
    withCredentials: true,
    parser: msgpack,
    auth: {
      token: token,
    },
  });
  return socket;
};
