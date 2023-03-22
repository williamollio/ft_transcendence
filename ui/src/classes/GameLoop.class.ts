import { positionalData } from "./positionalData.class";

export class GameLoop {
  interval: NodeJS.Timer | null;
  positionalData: positionalData;
  keyPressed: Array<string>;

  // for testing
  ticks: number;
  setTicks: React.Dispatch<React.SetStateAction<number>>;
  // for testing

  constructor(setTicks: React.Dispatch<React.SetStateAction<number>>) {
    this.interval = null;
    this.positionalData = new positionalData();
    this.keyPressed = [];

    // for testing
    this.ticks = 0;
    this.setTicks = setTicks;
    // for testing
  }

  resetPositions = () => {
    this.positionalData.resetPositions();
    this.handleMovement();
	this.ticks = 0;
    this.setTicks(0);
  };

  handleMovement = () => {
    if (typeof this.keyPressed !== "boolean") {
      if (this.keyPressed.some((key) => key === "ArrowUp")) {
        if (this.positionalData.playerLeftYOffset + 4 > -165)
          this.positionalData.playerLeftYOffset -= 4;
      } else if (this.keyPressed.some((key) => key === "ArrowDown")) {
        if (this.positionalData.playerLeftYOffset + 4 <= 175)
          this.positionalData.playerLeftYOffset += 4;
      }
    }
  };

  updateGame = () => {
    this.ticks++;
    this.setTicks(this.ticks);
    this.handleMovement();
  };

  startLoop = async () => {
    this.interval = setInterval(this.updateGame, 30);
  };

  stopLoop = () => {
    if (this.interval !== null) clearInterval(this.interval);
  };
}
