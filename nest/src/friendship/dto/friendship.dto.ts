import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '@prisma/client';

export class FriendshipDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  status: FriendshipStatus;
}
