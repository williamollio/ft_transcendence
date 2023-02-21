import { Position } from '../entities/game.interface';

export class PositionDto extends Position {
    room: string;
    player: number;
}