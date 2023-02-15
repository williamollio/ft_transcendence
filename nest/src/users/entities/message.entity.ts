import { Message } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

// @Injectable()
export class MessageEntity implements Message {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    channelId: string;

    @ApiProperty()
    sender: UserEntity;

    @ApiProperty()
    channel: ChannelEntity;
}