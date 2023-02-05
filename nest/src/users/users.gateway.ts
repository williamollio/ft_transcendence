import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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

// add some cors sanitazation here
@WebSocketGateway(8888, {
  parser: msgpack,
})
// add some guards here
export class UserGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly usersService: UsersService, // private readonly socketToIdService: SocketToUserIdStorage,
  ) {}

  @SubscribeMessage('connectUser')
  userConnect(
    @GetCurrentUserId() userId: number,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    void this.usersService.updateConnectionStatus(String(userId), UserStatus.ONLINE);
    clientSocket.broadcast.emit('userConnected');
  }

  @SubscribeMessage('disconnectUser')
  userDisconnect(@ConnectedSocket() clientSocket: Socket) {
    clientSocket.broadcast.emit('userDisconnected');
  }

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() clientSocket: Socket) {
    if (clientSocket.handshake.headers.cookie) {
      const base64Payload = clientSocket.handshake.headers.cookie.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const user: JwtUser = JSON.parse(
        payloadBuffer.toString(),
      ) as JwtUser;
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
      clientSocket.broadcast.emit('userDisconnected');
    }
  }
}