import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Friendship, FriendshipStatus } from '@prisma/client';
import { Response } from 'express';
import { GetFriendDto } from './dto/friend.dto';

const MESSAGE_ERROR_UPDATE_REQUEST = "This friendship can't be updated";

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  public async getNoFriendship(userId: string, res: Response) {
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

      const usersWithFriendship = new Set<string>();
      for (const friendship of userFriendships) {
        if (friendship.addresseeId !== userId) {
          usersWithFriendship.add(friendship.addresseeId);
        } else {
          usersWithFriendship.add(friendship.requesterId);
        }
      }

      const userWithoutFriendship = await this.prisma.user.findMany({
        where: {
          AND: [
            {
              NOT: {
                id: { equals: userId },
              },
            },
            {
              NOT: {
                id: { in: [...usersWithFriendship] },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });

      return res.status(HttpStatus.OK).send(userWithoutFriendship);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async getFriendshipsReceived(userId: string, res: Response) {
    try {
      const friendshipReceived = await this.prisma.friendship.findMany({
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
              status: true,
            },
          },
        },
      });

      const usersReceived: GetFriendDto[] = [];

      friendshipReceived.forEach((friendship) => {
        usersReceived.push({
          id: friendship.requester.id,
          name: friendship.requester.name,
          filename: friendship.requester.filename,
          status: friendship.requester.status,
        });
      });

      return res.status(HttpStatus.OK).send(usersReceived);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async getFriendshipRequested(userId: string, res: Response) {
    try {
      const friendshipRequested = await this.prisma.friendship.findMany({
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
              status: true,
            },
          },
        },
      });

      const usersRequested: GetFriendDto[] = [];

      friendshipRequested.forEach((friendship) => {
        usersRequested.push({
          id: friendship.addressee.id,
          name: friendship.addressee.name,
          filename: friendship.addressee.filename,
          status: friendship.addressee.status,
        });
      });

      return res.status(HttpStatus.OK).send(usersRequested);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async getFriendshipAccepted(userId: string, res: Response) {
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
              status: true,
            },
          },
          addressee: {
            select: {
              id: true,
              name: true,
              filename: true,
              status: true,
            },
          },
        },
      });

      const friends: GetFriendDto[] = [];

      friendshipRequests.forEach((friendship) => {
        if (friendship.requester.id !== userId) {
          friends.push({
            id: friendship.requester.id,
            name: friendship.requester.name,
            filename: friendship.requester.filename,
            status: friendship.requester.status,
          });
        }

        if (friendship.addressee.id !== userId) {
          friends.push({
            id: friendship.addressee.id,
            name: friendship.addressee.name,
            filename: friendship.addressee.filename,
            status: friendship.addressee.status,
          });
        }
      });

      return res.status(HttpStatus.OK).send(friends);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async createFriendship(
    userId: string,
    friendId: string,
    res: Response,
  ) {
    try {
      const friendshipCreated = await this.prisma.friendship.create({
        data: {
          requesterId: userId,
          addresseeId: friendId,
          status: FriendshipStatus.REQUESTED,
        },
      });
      return res.status(HttpStatus.OK).send(friendshipCreated);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async acceptFriendship(
    userId: string,
    friendId: string,
    res: Response,
  ) {
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
        const friendshipUpdated = await this.prisma.friendship.findFirst({
          where: {
            requesterId: friendId,
            addresseeId: userId,
          },
        });
        return res.status(HttpStatus.OK).send(friendshipUpdated);
      } else {
        throw MESSAGE_ERROR_UPDATE_REQUEST;
      }
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  public async deleteFriendship(
    userId: string,
    friendId: string,
    res: Response,
  ) {
    try {
      const friendshipDeleted = await this.prisma.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: friendId, addresseeId: userId },
            { requesterId: userId, addresseeId: friendId },
          ],
        },
      });
      return res.status(HttpStatus.OK).send(friendshipDeleted);
    } catch (error) {
      let errorMessage;
      if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'errorFriendshipService';
      }
      return res.status(HttpStatus.FORBIDDEN).send(errorMessage);
    }
  }

  private isFriendshipUpdateValid(
    type: FriendshipStatus,
    friendship: Friendship | null,
  ) {
    if (
      type === FriendshipStatus.ACCEPTED &&
      friendship?.status === FriendshipStatus.REQUESTED
    ) {
      return true;
    } else if (
      FriendshipStatus.ACCEPTED &&
      friendship?.status === FriendshipStatus.ACCEPTED
    ) {
      return false;
    } else {
      return false;
    }
  }
}
