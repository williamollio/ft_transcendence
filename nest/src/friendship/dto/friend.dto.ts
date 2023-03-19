import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class PatchFriendDto {
  @ApiProperty({ required: true })
  id: string;
}

export class GetFriendDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  filename: string | null;

  @ApiProperty({ required: true })
  status: UserStatus;
}
