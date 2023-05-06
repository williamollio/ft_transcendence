import { Socket } from "socket.io-client";
import { GameMode } from "../interfaces/chat.interface";
import { initSocket } from "../services/initSocket.service";

export class GameSocket {
  socket: Socket;
  latestGame: "PLAY" | "WATCH" | null;
  spectatingPlayerId: string;

  constructor() {
    this.socket = initSocket(`http://${window.location.hostname}:8888`, null);
    this.latestGame = null;
    this.spectatingPlayerId = "";
  }

  PP = (newPosition: number) => {
    this.socket.volatile.emit("PP", newPosition + 50);
  };

  leave = () => {
    if (this.latestGame === "PLAY") this.leaveGame();
    else if (this.latestGame === "WATCH") this.leaveAsSpectator();
  };

  leaveGame = () => {
    this.socket.emit("leaveGame");
  };

  rejoin = () => {
    this.socket.emit("reJoin");
  };

  refuseInvite = (challengerId: string) => {
    this.socket.emit("refuseInvite", challengerId);
  };

  inviteToGame = (mode: GameMode, opponentId: string) => {
    this.socket.emit("createInvitationGame", {
      mode: mode,
      opponent: opponentId,
    });
  };

  joinGame = (mode: GameMode, inviteGameId?: string) => {
    this.socket.emit("joinGame", { mode: mode, inviteGameId: inviteGameId });
  };

  joinAsSpectator = (playerId: string) => {
	this.spectatingPlayerId = playerId;
    this.socket.emit("watchGame", { playerId: playerId });
  };

  leaveAsSpectator = () => {
    this.socket.emit("leaveWatch", {playerId: this.spectatingPlayerId});
	this.spectatingPlayerId = "";
  };
}
