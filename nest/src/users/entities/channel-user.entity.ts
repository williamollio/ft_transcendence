import { ChannelUser } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';
import { ChannelRoleEntity } from './channel-role.entity';

// @Injectable()
export class ChannelUserEntity implements ChannelUser {
    @ApiProperty()
    userid: string;

    @ApiProperty()
    user: UserEntity;

    @ApiProperty()
    channelid: string;

    @ApiProperty()
    channel: ChannelEntity;

    @ApiProperty()
    role: ChannelRoleEntity;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
