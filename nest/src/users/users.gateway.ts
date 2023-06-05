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
@WebSocketGateway(3333, {
  cors: {
    origin: '*',
  },
  path: '/ft_transcendence/api',
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
  userConnect(@GetCurrentUserId() userId: string) {
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
    @MessageBody('requestedUsers') userIdFull: string[],
    @MessageBody('requestedList') listType: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    const userStatuses: { userId: string; status: UserStatus }[] = [];
    for (const userId of userIdFull) {
      const User = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          status: true,
        },
      });
      if (User) userStatuses.push({ userId: userId, status: User.status });
    }
    clientSocket.emit(`statusUpdateFull${listType}`, userStatuses);
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
  @SubscribeMessage('joinGameStatus')
  userInGame(@GetCurrentUserId() userId: string) {
    void this.usersService.updateConnectionStatus(userId, UserStatus.PLAYING);
    this.server.emit('statusUpdate', {
      id: userId,
      status: UserStatus.PLAYING,
    });
  }

  @SubscribeMessage('leaveGameStatus')
  gameEnded(@GetCurrentUserId() userId: string) {
    void this.usersService.updateConnectionStatus(userId, UserStatus.ONLINE);
    this.server.emit('statusUpdate', {
      id: userId,
      status: UserStatus.ONLINE,
    });
  }
}
