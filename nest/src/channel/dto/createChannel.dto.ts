import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// here added some validators to check if the data is valid ( maybe add more validators later on)

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;
}
