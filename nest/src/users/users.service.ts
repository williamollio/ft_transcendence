import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { Intra42User } from './interface/intra42-user.interface';
import { Response } from 'express';

// have to update this file and user response to display error

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async getFilename(id: string) {
    const User = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return User?.filename;
  }

  public async setFilename(filename: string, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        filename: filename,
      },
    });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const User = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          intraId: createUserDto.intraId,
        },
      });

      this.updateFriendsList(User.id, createUserDto);

      return User;
    } catch (error) {
      throw error;
    }
  }

  public async createFromIntra(dto: Intra42User): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: `${dto.providerId}`,
          intraId: dto.providerId,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async findByIntraId(intraId: string) {
    return this.prisma.user.findUnique({
      where: { intraId: intraId },
      include: { friends: false },
    });
  }

  private async updateFriendsList(
    userId: string,
    userDto: CreateUserDto | UpdateUserDto,
  ) {
    const currentFriends = await this.prisma.user
      .findUnique({ where: { id: userId } })
      .friends();

    const newFriends = userDto.friends;

    const friendsToRemove = currentFriends?.filter(
      (friend) => !newFriends?.find((f) => f.id === friend.id),
    );

    const friendsToRemoveArr: { id: string }[] = [];
    if (friendsToRemove) {
      for (const friendToRemove of friendsToRemove) {
        friendsToRemoveArr.push({ id: friendToRemove.id });
      }
    }

    const friendsToAdd = newFriends?.filter(
      (friend) => !currentFriends?.find((f) => f.id === friend.id),
    );

    const friendsToAddArr: { id: string }[] = [];
    if (friendsToAdd) {
      for (const friendToAdd of friendsToAdd) {
        friendsToAddArr.push({ id: friendToAdd.id });
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: friendsToRemoveArr,
          connect: friendsToAddArr,
        },
      },
    });
  }

  public async findAll(res: Response) {
    // return this.prisma.user.findMany({ include: { friends: true } });
    try {
      const nicknames = await this.prisma.user.findMany({
        select: {
          id: true,
          intraId: true,
          name: true,
          status: true,
        },
      });
      return res.status(200).send(nicknames);
    } catch (error) {
      return res.status(403).send();
    }
  }

  public async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friends: true },
    });
  }

  public async updateRefreshToken(userId: string, refreshToken: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
    } catch (e) {
      throw e;
    }
  }

  public async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const User = await this.prisma.user.update({
        where: { id: userId },
        data: { name: updateUserDto.name },
      });
      this.updateFriendsList(User.id, updateUserDto);
      return User;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: string, res: Response) {
    // return this.prisma.user.delete({ where: { id } });
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {}
    return res.send(204);
  }

  // channels api
  async updateConnectionStatus(userId: string, connectionStatus: UserStatus) {
    try {
      if (userId) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            status: connectionStatus,
          },
        });
      }
    } catch (error) {}
  }

  // change the status of the user to offline
  async logout(res: Response, userId: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status: UserStatus.OFFLINE,
        },
      });
      return res.status(200).clearCookie('jwtToken', { httpOnly: true }).send(); // maybe like this
    } catch (error) {
      return res.status(403).send();
    }
  }

  // channel invites
  async getChannelInvites(userId: string) {
    try {
      const invitesList = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          invites: {
            select: {
              id: true,
            },
          },
        },
      });
      if (invitesList) {
        const invites: { id: string }[] = [];
        for (const invitees of invitesList.invites) {
          invites.push(invitees);
        }
        return invites;
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
