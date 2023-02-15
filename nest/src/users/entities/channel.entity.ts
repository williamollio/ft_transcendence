import { Channel, ChannelType } from '@nestjs/client';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from './message.entity';
import { ChannelUserEntity } from './channel-user.entity';
import { ChannelActionEntity } from './channel-action.entity';
import { UserEntity } from './user.entity';

// @Injectable()
export class ChannelEntity implements Channel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    type: ChannelType;

    @ApiProperty()
    passwordHash: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    messages: MessageEntity[];

    @ApiProperty()
    users: ChannelUserEntity[];

    @ApiProperty()
    channelActionOnChannel: ChannelActionEntity[];

    @ApiProperty()
    invitees: UserEntity[];
}