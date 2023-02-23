import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// here added some validators to check if the data is valid ( maybe add more validators later on)

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: ChannelType;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
