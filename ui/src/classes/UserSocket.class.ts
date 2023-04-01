import { Socket } from "socket.io-client";
import { initSocket } from "../services/initSocket.service";

export class UserSocket {
  socket: Socket;

  constructor() {
    this.socket = initSocket("http://localhost:8888", null);
  }

  logIn = () => {
    this.socket.emit("connectUser");
  };

  joinGame = () => {
    this.socket.emit("joinGame");
  };

  leaveGame = () => {
    this.socket.emit("leaveGame");
  };

  status = () => {
    this.socket.emit("status");
  };

  logOut = () => {
    this.socket.disconnect();
  };
}
