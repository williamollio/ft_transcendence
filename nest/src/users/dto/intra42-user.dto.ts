import { ApiProperty } from '@nestjs/swagger';

export class Intra42UserDto {
  @ApiProperty({ required: true })
  providerId: number;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  provider: string;
}
