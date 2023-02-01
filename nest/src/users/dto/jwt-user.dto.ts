import { ApiProperty } from '@nestjs/swagger';

export class JwtUserDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  intraId: number;
}
