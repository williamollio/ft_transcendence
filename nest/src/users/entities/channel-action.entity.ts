import { ChannelAction, ChannelActionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

// @Injectable()
export class ChannelActionEntity implements ChannelAction {
    @ApiProperty()
    channelActionTargetId: string;

    @ApiProperty()
    channelActionTarget: UserEntity;

    @ApiProperty()
    channelActionOnChannelId: string;

    @ApiProperty()
    channelActionOnChannel: ChannelEntity;

    @ApiProperty()
    channelActionRequesterId: string;

    @ApiProperty()
    channelActionRequester: UserEntity;

    @ApiProperty()
    type: ChannelActionType;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
