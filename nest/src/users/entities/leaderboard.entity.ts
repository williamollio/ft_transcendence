import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  filename: string | null;

  @ApiProperty()
  eloScore: number;
}
