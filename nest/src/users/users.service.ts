import { Injectable } from '@nestjs/common';
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

  public async getFilename(id: number) {
    const User = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return User?.filename;
  }

  public async setFilename(filename: string, userName: string) {
    await this.prisma.user.update({
      where: { name: userName },
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
          intraId: -1, // TODO : Needs to be adjusted
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
          intraId: +dto.providerId,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async findByIntraId(intraId: String) {
    return this.prisma.user.findUnique({
      where: { intraId: +intraId },
      include: { friends: false },
    });
  }

  private async updateFriendsList(
    userId: number,
    userDto: CreateUserDto | UpdateUserDto,
  ) {
    const sizeFriendsArray = userDto.friends?.length ?? 0;

    for (let i = 0; i < sizeFriendsArray; i++) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          friends: { connect: [{ id: userDto.friends?.[i].id }] },
        },
      });
    }
  }

  public async findAll(res : Response) {
    // return this.prisma.user.findMany({ include: { friends: true } });
    try {
      const nicknames = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
      return res.status(200).send(nicknames);
    } catch (error) {
      return res.status(403).send();
    }
  }

  public async findOne(id: String) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friends: true },
    });
  }

  public async findByName(name: string) {
    return this.prisma.user.findUnique({
      where: { name },
      include: { friends: false },
    });
  }

  public async update(id: String, updateUserDto: UpdateUserDto) {
    try {
      const User = await this.prisma.user.update({
        where: { id },
        data: { name: updateUserDto.name },
      });
      this.updateFriendsList(User.id, updateUserDto);
      return User;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: String, res : Response) {
    // return this.prisma.user.delete({ where: { id } });
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
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
  async getChannelInvites(userId: String) {
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
