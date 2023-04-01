import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserStatus } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { JwtUser } from './interface/types';
import { GetCurrentUserId } from '../decorators/getCurrentUserId.decorator';
import { socketToUserId } from './socketToUserIdStorage.service';
import { UsersService } from './users.service';
import * as msgpack from 'socket.io-msgpack-parser';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

// add some cors sanitazation here
@WebSocketGateway(8888, {
  cors: {
    credentials: true,
    origin: process.env.PATH_TO_FRONTEND,
  },
  parser: msgpack,
})
// add some guards here
@UseGuards(JwtGuard)
export class UserGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly usersService: UsersService, // private readonly socketToIdService: SocketToUserIdStorage,
    private prisma: PrismaService,
  ) {}

  @SubscribeMessage('connectUser')
  userConnect(
    @GetCurrentUserId() userId: string,
  ) {
    void this.usersService.updateConnectionStatus(
      String(userId),
      UserStatus.ONLINE,
    );
    this.server.emit('statusUpdate', {
      id: userId,
      status: UserStatus.ONLINE,
    });
  }

  @SubscribeMessage('disconnectUser')
  userDisconnect(@ConnectedSocket() clientSocket: Socket) {
    clientSocket.broadcast.emit('userDisconnected');
  }

  @SubscribeMessage('status')
  async statusRequest(
    @MessageBody('requestedUser') userId: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const User = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        status: true,
      },
    });
    clientSocket.emit('statusUpdate', { id: userId, status: User?.status });
  }

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() clientSocket: Socket) {
    if (clientSocket.handshake.auth) {
      const base64Payload = clientSocket.handshake.auth.token.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const user: JwtUser = JSON.parse(payloadBuffer.toString()) as JwtUser;
      socketToUserId.set(clientSocket.id, String(user.id));
      clientSocket.emit('userConnected');
    }
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() clientSocket: Socket) {
    // const userId = this.socketToIdService.get(clientSocket.id);
    const userId = socketToUserId.get(clientSocket.id);
    if (userId) {
      void this.usersService.updateConnectionStatus(userId, UserStatus.OFFLINE);
      // this.socketToIdService.delete(clientSocket.id);
      socketToUserId.delete(clientSocket.id);
      this.server.emit('statusUpdate', {
        id: userId,
        status: UserStatus.OFFLINE,
      });
    }
  }

  // Game gateway
  @SubscribeMessage('joinGame')
  userInGame(@GetCurrentUserId() userId: string) {
    void this.usersService.updateConnectionStatus(userId, UserStatus.PLAYING);
    this.server.emit('statusUpdate', {
      id: userId,
      status: UserStatus.PLAYING,
    });
  }

  @SubscribeMessage('leaveGame')
  gameEnded(@GetCurrentUserId() userId: string) {
    void this.usersService.updateConnectionStatus(userId, UserStatus.ONLINE);
    this.server.emit('statusUpdate', {
      id: userId,
      status: UserStatus.ONLINE,
    });
  }
}
