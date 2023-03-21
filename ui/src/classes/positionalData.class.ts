export class positionalData {
  playerLeftY: number;
  playerRightY: number;
  ballPos: { x: number; y: number };

  constructor() {
	this.playerLeftY = 175;
    this.playerRightY = 175;
	this.ballPos = { x: 285, y: 210 };
  }

  resetPositions = () => {
	this.playerLeftY = 185;
    this.playerRightY = 185;
	this.ballPos = { x: 285, y: 210 };
  }
}
