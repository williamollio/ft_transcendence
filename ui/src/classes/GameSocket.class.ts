import { Socket } from "socket.io-client";
import { GameMode } from "../interfaces/chat.interface";
import { initSocket } from "../services/initSocket.service";

export class GameSocket {
  socket: Socket;

  constructor() {
    this.socket = initSocket("http://localhost:4444", null);
  }

  leaveGame = () => {
    this.socket.emit("leaveGame");
  };

  rejoin = () => {
    this.socket.emit("reJoin");
  };

  refuseInvite = (challengerId: string) => {
    this.socket.emit("refuseInvite", challengerId);
  };

  inviteToGame = (mode: string, opponentId: string) => {
    this.socket.emit("createInvitationGame", {
      mode: mode,
      opponent: opponentId,
    });
  };

  joinGame = (mode: GameMode) => {
	this.socket.emit("joinGame", {mode: mode});
  };

  joinAsSpectator = (playerId: string) => {
	this.socket.emit("watchGame", {playerId: playerId});
  }

  leaveAsSpectator = () => {
	this.socket.emit("leaveWatch");
  }
}
