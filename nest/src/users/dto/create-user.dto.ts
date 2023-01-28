import { ApiProperty } from '@nestjs/swagger';

interface Friends {
  id: number;
}
export class CreateUserDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  friends?: Friends[];
}
