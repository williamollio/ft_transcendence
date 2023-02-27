import { ApiProperty } from '@nestjs/swagger';

export class FriendshipDto {
  @ApiProperty({ required: true })
  id: string;
}
