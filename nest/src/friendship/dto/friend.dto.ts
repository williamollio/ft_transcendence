import { ApiProperty } from '@nestjs/swagger';

export class FriendDto {
  @ApiProperty({ required: true })
  id: string;
}
