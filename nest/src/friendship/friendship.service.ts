import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Friendship, FriendshipStatus } from '@prisma/client';

const MESSAGE_ERROR_UPDATE_REQUEST = "This friendship can't be updated";
@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  public async getNoFriendship(currentUserId: string) {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
        },
      });

      const friendships = await this.prisma.friendship.findMany({
        select: {
          addresseeId: true,
          requesterId: true,
        },
      });
      const usersWithoutFriendshipWithCurrentUser = [];
      for (const user of users) {
        for (const friendship of friendships) {
          if (
            (user.id === friendship.addresseeId ||
              user.id === friendship.requesterId) &&
            (currentUserId === friendship.addresseeId ||
              currentUserId === friendship.requesterId)
          ) {
            continue;
          } else {
            usersWithoutFriendshipWithCurrentUser.push(user);
          }
        }
      }
      return usersWithoutFriendshipWithCurrentUser;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async getFrienshipRequests(userId: string) {
    try {
      const friendshipRequests = await this.prisma.friendship.findMany({
        where: {
          requesterId: userId,
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
          OR: [
            { requesterId: userId, status: FriendshipStatus.ACCEPTED },
            { addresseeId: userId, status: FriendshipStatus.ACCEPTED },
          ],
        },
      });
      return friendshipRequests;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async getFrienshipsRequestsReceived(userId: string) {
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

  public async createFrienship(userId: string, friendId: string) {
    try {
      const friendship = await this.prisma.friendship.create({
        data: {
          requesterId: userId,
          addresseeId: friendId,
          status: FriendshipStatus.REQUESTED,
        },
      });
      return friendship;
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  // TODO : William requested can accept friendship
  public async acceptFriendship(userId: string, friendId: string) {
    try {
      const friendship = await this.prisma.friendship.findFirst({
        where: {
          requesterId: friendId,
          addresseeId: userId,
        },
      });

      if (
        friendship &&
        this.isFriendshipUpdateValid(FriendshipStatus.ACCEPTED, friendship)
      ) {
        await this.prisma.friendship.updateMany({
          where: {
            requesterId: friendship.requesterId,
            addresseeId: friendship.addresseeId,
          },
          data: { status: FriendshipStatus.ACCEPTED },
        });
        return await this.prisma.friendship.findFirst({
          where: {
            requesterId: friendId,
            addresseeId: userId,
          },
        });
      } else {
        throw MESSAGE_ERROR_UPDATE_REQUEST;
      }
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  public async denyFriendship(userId: string, friendId: string) {
    try {
      const friendship = await this.prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: friendId, addresseeId: userId },
            { requesterId: userId, addresseeId: friendId },
          ],
        },
      });

      if (
        FriendshipStatus.DENY &&
        friendship?.status === FriendshipStatus.DENY
      ) {
        throw MESSAGE_ERROR_UPDATE_REQUEST;
      }
      if (friendship) {
        await this.prisma.friendship.updateMany({
          where: {
            OR: [
              { requesterId: friendId, addresseeId: userId },
              { requesterId: userId, addresseeId: friendId },
            ],
          },
          data: { status: FriendshipStatus.DENY },
        });
      } else {
        throw MESSAGE_ERROR_UPDATE_REQUEST;
      }
      return await this.prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: friendId, addresseeId: userId },
            { requesterId: userId, addresseeId: friendId },
          ],
        },
      });
    } catch (error) {
      if (typeof error === 'string') return error;
      return 'errorUserService';
    }
  }

  private isFriendshipUpdateValid(
    type: FriendshipStatus,
    friendship: Friendship | null,
  ) {
    if (
      FriendshipStatus.ACCEPTED &&
      friendship?.status === FriendshipStatus.ACCEPTED
    ) {
      throw MESSAGE_ERROR_UPDATE_REQUEST;
    } else if (
      type === FriendshipStatus.ACCEPTED &&
      friendship?.status === FriendshipStatus.REQUESTED
    ) {
      return true;
    } else if (
      type === FriendshipStatus.DENY &&
      friendship?.status === FriendshipStatus.REQUESTED
    ) {
      return true;
    } else {
      return false;
    }
  }
}
