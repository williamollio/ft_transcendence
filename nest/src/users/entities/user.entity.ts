import { User, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from './message.entity';
import { ChannelUserEntity } from './channel-user.entity';
import { ChannelActionEntity } from './channel-action.entity';
import { BlockedUserEntity } from './blocked-user.entity';
import { ChannelEntity } from './channel.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  intraId: string;

  @ApiProperty()
  friends: User[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  filename: string | null;

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  messageSent?: MessageEntity[];

  @ApiProperty()
  userOnChannel?: ChannelUserEntity[];

  @ApiProperty()
  channelActionRequester?: ChannelActionEntity[];

  @ApiProperty()
  channelActionTarget?: ChannelActionEntity[];

  @ApiProperty()
  channelBlockedRequster?: BlockedUserEntity[];

  @ApiProperty()
  channelBlockedTarget?: BlockedUserEntity[];

  @ApiProperty()
  invites?: ChannelEntity[];
}

