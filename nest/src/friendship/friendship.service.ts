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

  public async getFrienshipRequests(userId: string) {
    try {
      const friendshipRequests = await this.prisma.friendship.findMany({
        where: {
          addresseeId: userId,
          status: FriendshipStatus.REQUESTED,
        },
      });
      return friendshipRequests;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async getFrienshipAccepted(userId: string) {
    try {
      const friendshipRequests = await this.prisma.friendship.findMany({
        where: {
          addresseeId: userId,
          status: FriendshipStatus.ACCEPTED,
        },
      });
      return friendshipRequests;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async acceptFrienshipRequest(userId: string, friendId: string) {
    try {
      const friendship = await this.prisma.friendship.findFirst({
        where: {
          requesterId: userId,
          addresseeId: friendId,
        },
      });
      if (friendship) {
        await this.prisma.friendship.updateMany({
          where: {
            requesterId: friendship.requesterId,
            addresseeId: friendship.addresseeId,
          },
          data: { status: FriendshipStatus.ACCEPTED },
        });
      } else {
        throw "This friendship doesn't exists";
      }
      return friendship;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async denyFrienshipRequest(userId: string, friendId: string) {
    try {
      const friendship = await this.prisma.friendship.findFirst({
        where: {
          requesterId: userId,
          addresseeId: friendId,
        },
      });
      if (friendship) {
        await this.prisma.friendship.updateMany({
          where: {
            requesterId: friendship.requesterId,
            addresseeId: friendship.addresseeId,
          },
          data: { status: FriendshipStatus.DENY },
        });
      } else {
        throw "This friendship doesn't exists";
      }
      return friendship;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }
}
