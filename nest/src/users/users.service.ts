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
      const User = await this.prisma.user.create({ data: createUserDto });
      return User;
    } catch (error) {
      throw error;
    }
  }

  public async findAll() {
    return this.prisma.user.findMany({});
  }

  public async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  public async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
