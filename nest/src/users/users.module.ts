// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketToUserIdStorage } from './socketToUserIdStorage.service';
// import { UsersGateway } from './users.gateway';
import 'socket.io-msgpack-parser';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SocketToUserIdStorage],
  imports: [PrismaModule],
  exports: [UsersService, SocketToUserIdStorage],
})
export class UsersModule {}
