import { User, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from './message.entity';
import { ChannelUserEntity } from './channel-user.entity';
import { ChannelActionEntity } from './channel-action.entity';
import { BlockedUserEntity } from './blocked-user.entity';
import { ChannelEntity } from './channel.entity';
import { Injectable } from '@nestjs/common';
import { MatchEntity } from './match.entity';

@Injectable()
export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  intraId: string;

  @ApiProperty()
  creationMode: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  refreshToken: string | null;

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

  @ApiProperty()
  eloScore: number;

  @ApiProperty()
  playerOneMatch?: MatchEntity[];

  @ApiProperty()
  playerTwoMatch?: MatchEntity[];

  @ApiProperty()
  secondFactorEnabled: boolean;

  @ApiProperty()
  secondFactorLogged: boolean;

  @ApiProperty()
  secondFactorCode: string | null;

  @ApiProperty()
  secondFactorSecret: string | null;
}
