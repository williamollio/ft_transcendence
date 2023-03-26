import { GameSocket } from "./GameSocket.class";
import { positionalData } from "./positionalData.class";

export class GameLoop {
  interval: NodeJS.Timer | null;
  positionalData: positionalData;
  keyPressed: Array<string>;
  gameSocket: GameSocket;
  activePlayer: number;

  // for testing
  ticks: number;
  setTicks: React.Dispatch<React.SetStateAction<number>>;
  // for testing

  constructor(
    setTicks: React.Dispatch<React.SetStateAction<number>>,
    gameSocket: GameSocket
  ) {
    this.interval = null;
    this.positionalData = new positionalData();
    this.keyPressed = [];
    this.gameSocket = gameSocket;
    this.activePlayer = 0;

    // for testing
    this.ticks = 0;
    this.setTicks = setTicks;
    // for testing
  }

  resetPositions = () => {
    this.stopLoop();
    this.positionalData.resetPositions();
    this.handleMovement();
    this.ticks = 0;
    this.setTicks(0);
  };

  handleMovement = () => {
    if (typeof this.keyPressed !== "boolean") {
      if (this.keyPressed.some((key) => key === "ArrowUp")) {
        if (this.positionalData.playerLeftYOffset - 5 > 0) {
          if (this.activePlayer === 1) {
            this.positionalData.playerLeftYOffset -= 5;
          } else if (this.activePlayer === 2){
            this.positionalData.playerRightYOffset -= 5;
          }
        }
      } else if (this.keyPressed.some((key) => key === "ArrowDown")) {
        if (this.positionalData.playerLeftYOffset + 5 <= 350) {
          if (this.activePlayer === 1) {
            this.positionalData.playerLeftYOffset += 5;
          } else if (this.activePlayer === 2){
            this.positionalData.playerRightYOffset += 5;
          }
        }
      }
    }
  };

  updateGame = () => {
    this.ticks++;
    this.setTicks(this.ticks);
    this.handleMovement();
    this.gameSocket.PP(
      this.activePlayer === 1
        ? this.positionalData.playerLeftYOffset
        : this.positionalData.playerRightYOffset
    );
  };

  startLoop = async () => {
    console.log("starting");
    if (!this.interval) this.interval = setInterval(this.updateGame, 30);
  };

  stopLoop = () => {
    console.log("stopping");
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };
}
