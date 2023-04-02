import { ballPosition } from "../interfaces/game.interface";

export class positionalData {
  playerLeftYOffset: number;
  playerRightYOffset: number;
  ballOffset: ballPosition;

  constructor() {
    this.playerLeftYOffset = 175;
    this.playerRightYOffset = 175;
    this.ballOffset = { x: 321, y: 210 };
  }

  resetPositions = () => {
    this.playerLeftYOffset = 175;
    this.playerRightYOffset = 175;
    this.ballOffset = { x: 321, y: 210 };
  };
}
