import React from "react";
import { GameMode } from "../interfaces/chat.interface";
import { GameConstants, scoreInfo } from "../interfaces/game.interface";
import { GameSocket } from "./GameSocket.class";
import { positionalData } from "./positionalData.class";
import { UserSocket } from "./UserSocket.class";

export class GameLoop {
  interval: NodeJS.Timer | null;
  positionalData: positionalData;
  keyPressed: Array<string>;
  gameSocket: GameSocket;
  userSocket: UserSocket;
  activePlayer: number;
  gameMode: GameMode;
  scoreInfo: scoreInfo;
  gameConstants: GameConstants;

  constructor(gameSocket: GameSocket, userSocket: UserSocket, constants: GameConstants) {
    this.interval = null;
	this.gameConstants = constants;
    this.positionalData = new positionalData(constants);
    this.keyPressed = [];
    this.gameSocket = gameSocket;
    this.userSocket = userSocket;
    this.activePlayer = 0;
    this.gameMode = GameMode.CLASSIC;
    this.scoreInfo = {
      p1s: 0,
      p2s: 0,
      p1name: "",
      p2name: "",
      p1Id: "",
      p2Id: "",
    };
  }

  resetPositions = (togglePause: React.Dispatch<React.SetStateAction<boolean>>) => {
    this.stopLoop(togglePause);
    this.positionalData.resetPositions();
  };

  handleMovement = () => {
    if (typeof this.keyPressed !== "boolean") {
      if (this.keyPressed.some((key) => key === "ArrowUp")) {
        if (
          this.activePlayer === 1 &&
          this.positionalData.playerLeftYOffset - 5 > 0
        ) {
          this.positionalData.playerLeftYOffset -= 5;
        } else if (
          this.activePlayer === 2 &&
          this.positionalData.playerRightYOffset - 5 > 0
        ) {
          this.positionalData.playerRightYOffset -= 5;
        }
      } else if (this.keyPressed.some((key) => key === "ArrowDown")) {
        if (
          this.activePlayer === 1 &&
          this.positionalData.playerLeftYOffset + 5 < this.gameConstants.boardHeight - this.gameConstants.paddleSize
        ) {
          this.positionalData.playerLeftYOffset += 5;
        } else if (
          this.activePlayer === 2 &&
          this.positionalData.playerRightYOffset + 5 < this.gameConstants.boardHeight - this.gameConstants.paddleSize
        ) {
          this.positionalData.playerRightYOffset += 5;
        }
      }
    }
  };

  updateGame = () => {
    this.handleMovement();
    this.gameSocket.PP(
      this.activePlayer === 1
        ? this.positionalData.playerLeftYOffset
        : this.positionalData.playerRightYOffset
    );
  };

  startLoop = async (togglePause: React.Dispatch<React.SetStateAction<boolean>>) => {
	this.userSocket.joinGame();
    togglePause(false);
	if (!this.interval) this.interval = setInterval(this.updateGame, 30);
  };

  stopLoop = (togglePause: React.Dispatch<React.SetStateAction<boolean>>) => {
    this.userSocket.leaveGame();
	togglePause(true);
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };
}
