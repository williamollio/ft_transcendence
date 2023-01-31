import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

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
        },
      });

      this.updateFriendsList(User.id, createUserDto);

      return User;
    } catch (error) {
      throw error;
    }
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

  public async findAll() {
    return this.prisma.user.findMany({ include: { friends: true } });
  }

  public async findOne(id: number) {
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

  public async update(id: number, updateUserDto: UpdateUserDto) {
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

  public async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
