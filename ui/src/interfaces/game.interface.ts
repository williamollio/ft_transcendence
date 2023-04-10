export interface ballPosition {
  x: number;
  y: number;
}

export const failedEvents: Array<string> = ["inviteRefused", "gameJoinFail"];

export interface scoreInfo {
  p1s: number;
  p2s: number;
  p1name: string;
  p2name: string;
  p1Id: string;
  p2Id: string;
}

export enum GameState {
  WIN = "WIN",
  LOSS = "LOSS",
}

export interface GameConstants {
  boardWidth: number;
  boardHeight: number;
  paddleRelativeOffset: number;
  paddleSize: number;
  paddleWidth: number;
  ballSize: number;
  playerSpeed: number;
}
