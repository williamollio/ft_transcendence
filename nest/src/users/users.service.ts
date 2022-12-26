import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    UserId: number,
    userDto: CreateUserDto | UpdateUserDto,
  ) {
    const sizeFriendsArray = userDto.friends?.length ?? 0;

    for (let i = 0; i < sizeFriendsArray; i++) {
      await this.prisma.user.update({
        where: { id: UserId },
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
