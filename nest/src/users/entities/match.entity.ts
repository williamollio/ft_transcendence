import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class MatchEntity {
    @ApiProperty()
    gameId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    p1s: number;

    @ApiProperty()
    p2s: number;

    @ApiProperty()
    playerOneId: string;

    @ApiProperty()
    playerOne: UserEntity;

    @ApiProperty()
    playerTwoId: string;

    @ApiProperty()
    playerTwo: UserEntity;
}