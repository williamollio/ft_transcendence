import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Friendship, FriendshipStatus } from '@prisma/client';

const MESSAGE_ERROR_UPDATE_REQUEST = "This friendship can't be updated";
@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  public async getNoFriendship(userId: string) {
    try {
      const userFriendships = await this.prisma.friendship.findMany({
        where: {
          OR: [{ addresseeId: userId }, { requesterId: userId }],
        },
        select: {
          addresseeId: true,
          requesterId: true,
        },
      });

      const userIdsWithFriendship = new Set<string>();
      for (const friendship of userFriendships) {
        if (friendship.addresseeId !== userId) {
          userIdsWithFriendship.add(friendship.addresseeId);
        } else {
          userIdsWithFriendship.add(friendship.requesterId);
        }
      }

      const userIdsWithoutFriendship = await this.prisma.user.findMany({
        where: {
          NOT: {
            id: { in: [...userIdsWithFriendship] },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return userIdsWithoutFriendship;
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
        select: {
          addressee: {
            select: {
              id: true,
              name: true,
              filename: true,
            },
          },
        },
      });

      const users: {
        id: string;
        name: string;
        filename: string | null;
      }[] = [];

      friendshipRequests.forEach((friendship) => {
        users.push({
          id: friendship.addressee.id,
          name: friendship.addressee.name,
          filename: friendship.addressee.filename,
        });
      });

      return users;
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
        select: {
          requester: {
            select: {
              id: true,
              name: true,
              filename: true,
            },
          },
          addressee: {
            select: {
              id: true,
              name: true,
              filename: true,
            },
          },
        },
      });

      const users: {
        id: string;
        name: string;
        filename: string | null;
      }[] = [];

      friendshipRequests.forEach((friendship) => {
        if (friendship.requester.id !== userId) {
          users.push({
            id: friendship.requester.id,
            name: friendship.requester.name,
            filename: friendship.requester.filename,
          });
        }

        if (friendship.addressee.id !== userId) {
          users.push({
            id: friendship.addressee.id,
            name: friendship.addressee.name,
            filename: friendship.addressee.filename,
          });
        }
      });

      return users;
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
        select: {
          requester: {
            select: {
              id: true,
              name: true,
              filename: true,
            },
          },
        },
      });

      const users: {
        id: string;
        name: string;
        filename: string | null;
      }[] = [];

      friendshipRequests.forEach((friendship) => {
        users.push({
          id: friendship.requester.id,
          name: friendship.requester.name,
          filename: friendship.requester.filename,
        });
      });

      return users;
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

  public async deleteFriendship(userId: string, friendId: string) {
    try {
      const friendshipDeleted = await this.prisma.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: friendId, addresseeId: userId },
            { requesterId: userId, addresseeId: friendId },
          ],
        },
      });
      return friendshipDeleted;
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
    } else {
      return false;
    }
  }
}
