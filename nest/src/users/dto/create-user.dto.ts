import { ApiProperty } from '@nestjs/swagger';

export interface Friends {
  id: string;
}
export class CreateUserDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  intraId: string;

  @ApiProperty()
  friends?: Friends[];

  // maybe add also a picture here
}
