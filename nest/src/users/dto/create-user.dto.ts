import { ApiProperty } from '@nestjs/swagger';

interface Friends {
  id: number;
}
export class CreateUserDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  friends?: Friends[];

  // maybe add also a picture here
}
