import { ChannelUser, ChannelRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

// @Injectable()
export class ChannelUserEntity {
    @ApiProperty()
    userid: string;

    @ApiProperty()
    user: UserEntity;

    @ApiProperty()
    channelid: string;

    @ApiProperty()
    channel: ChannelEntity;

    @ApiProperty()
    role: ChannelRole;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
