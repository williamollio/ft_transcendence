import { Position } from '../entities/game.entity';

export interface PositionDto extends Position {
  room: string;
  player: number;
}
