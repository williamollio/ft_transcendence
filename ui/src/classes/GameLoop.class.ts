import { GameMode } from "../interfaces/chat.interface";
import { scoreInfo } from "../interfaces/game.interface";
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

  constructor(gameSocket: GameSocket, userSocket: UserSocket) {
    this.interval = null;
    this.positionalData = new positionalData();
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

  resetPositions = () => {
    this.stopLoop();
    this.positionalData.resetPositions();
    this.handleMovement();
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
          this.positionalData.playerLeftYOffset + 5 < 350
        ) {
          this.positionalData.playerLeftYOffset += 5;
        } else if (
          this.activePlayer === 2 &&
          this.positionalData.playerRightYOffset + 5 < 350
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

  startLoop = async () => {
    console.log("starting");
    this.userSocket.joinGame();
    if (!this.interval) this.interval = setInterval(this.updateGame, 30);
  };

  stopLoop = () => {
    console.log("stopping");
    this.userSocket.leaveGame();
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };
}
