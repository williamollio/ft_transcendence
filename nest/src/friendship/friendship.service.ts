import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipStatus } from '@prisma/client';
import { FriendshipDto } from './dto/friendship.dto';
@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  public async addFrienshipRequests(
    userId: string,
    friendsRequested: FriendshipDto[],
  ) {
    try {
      for (const friendRequested of friendsRequested) {
        await this.prisma.friendship.create({
          data: {
            requesterId: userId,
            addresseeId: friendRequested.id,
            status: FriendshipStatus.REQUESTED,
          },
        });
      }
      return;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }
}
