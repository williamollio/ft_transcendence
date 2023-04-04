import { GameConstants, ballPosition } from "../interfaces/game.interface";

export class positionalData {
  playerLeftYOffset: number;
  playerRightYOffset: number;
  ballOffset: ballPosition;
  gameConstants: GameConstants;

  constructor(constants: GameConstants, newPosition?: positionalData) {
    this.gameConstants = constants;
    if (!newPosition) {
      this.ballOffset = {
        x: this.gameConstants.boardWidth / 2 - this.gameConstants.ballSize / 2,
        y: this.gameConstants.boardHeight / 2 - this.gameConstants.ballSize / 2,
      };
      this.playerLeftYOffset =
        this.gameConstants.boardHeight / 2 - this.gameConstants.paddleSize / 2;
      this.playerRightYOffset =
        this.gameConstants.boardHeight / 2 - this.gameConstants.paddleSize / 2;
    } else {
      this.ballOffset = this.updateBallPosition(
        newPosition.ballOffset,
      );
      this.playerLeftYOffset = newPosition.playerLeftYOffset;
      this.playerRightYOffset = newPosition.playerRightYOffset;
    }
  }

  updateBallPosition = (
    newPosition: ballPosition,
  ): ballPosition => {
    if (
      newPosition.y + this.gameConstants.ballSize >
      this.gameConstants.boardHeight
    ) {
      newPosition.y =
        this.gameConstants.boardHeight - this.gameConstants.ballSize;
    } else if (newPosition.y < 0) {
      newPosition.y = 0;
    }

    return newPosition;
  };

  resetPositions = () => {
    this.playerLeftYOffset =
      this.gameConstants.boardHeight / 2 - this.gameConstants.paddleSize / 2;
    this.playerRightYOffset =
      this.gameConstants.boardHeight / 2 - this.gameConstants.paddleSize / 2;
    this.ballOffset = {
      x: this.gameConstants.boardWidth / 2 - this.gameConstants.ballSize / 2,
      y: this.gameConstants.boardHeight / 2 - this.gameConstants.ballSize / 2,
    };
  };
}
