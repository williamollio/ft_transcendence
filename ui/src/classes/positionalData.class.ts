import { ballPosition } from "../interfaces/game.interface";

export class positionalData {
  playerLeftYStart: number;
  playerRightYStart: number;
  ballPosStart: ballPosition;
  
  playerLeftYOffset: number;
  playerRightYOffset: number;
  ballOffset: ballPosition;
  
  constructor() {
	this.playerLeftYStart = 175;
    this.playerRightYStart = 175;
	this.ballPosStart = { x: 285, y: 210 };

	this.playerLeftYOffset = 0;
	this.playerRightYOffset = 0;
	this.ballOffset = {x: 0, y: 0};
  }

  resetPositions = () => {
	this.playerLeftYOffset = 0;
	this.playerRightYOffset = 0;
	this.ballOffset = {x: 0, y: 0};
  }
}
