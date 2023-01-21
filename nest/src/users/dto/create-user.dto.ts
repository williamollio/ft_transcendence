import { ApiProperty } from '@nestjs/swagger';

class Friends {
  id: number;
}
export class CreateUserDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  friends?: Friends[];
}
