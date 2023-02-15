import { BlockedUser } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

// @Injectable()
export class BlockedUserEntity {
    @ApiProperty()
    channelBlockedRequsterId: string;

    @ApiProperty()
    channelBlockedRequster: UserEntity;

    @ApiProperty()
    channelBlockedTargetId: string;

    @ApiProperty()
    channelBlockedTarget: UserEntity;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}