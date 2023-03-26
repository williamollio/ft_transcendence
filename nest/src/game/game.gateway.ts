import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
// import { JwtAuthGuard } from 'src/auth/guard/jwt.auth-guard';
import { Body, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { FrontendUser, GameMode } from './entities/game.entity';
import * as msgpack from 'socket.io-msgpack-parser';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { gameSocketToUserId } from './socketToUserIdStorage.service';
import { JwtUser } from 'src/users/interface/jwt-user.interface';

@WebSocketGateway(4444, {
  cors: {
    credentials: true,
    origin: process.env.PATH_TO_FRONTEND,
  },
  parser: msgpack,
})
@UseGuards(JwtGuard)
export class GameGateway {
  @WebSocketServer()
  server: Server;
  socketToId = new Map<string, string>();

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() clientSocket: Socket) {
    if (clientSocket.handshake.auth) {
      const base64Payload = clientSocket.handshake.auth.token.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const user: JwtUser = JSON.parse(payloadBuffer.toString()) as JwtUser;
      gameSocketToUserId.set(clientSocket.id, String(user.id));
      clientSocket.emit('userConnected');
    }
  }

  @SubscribeMessage('PP')
  create(@MessageBody() encoded: number, @GetCurrentUserId() id: string) {
    this.gameService.create(encoded, id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    gameSocketToUserId.delete(client.id);
    const id = this.socketToId.get(client.id);
    if (id) this.gameService.pause(id, this.server);
  }

  @SubscribeMessage('leaveGame')
  handleAbandon(@ConnectedSocket() client: Socket) {
    const id = this.socketToId.get(client.id);
    if (id) this.gameService.pause(id, this.server);
  }
  @SubscribeMessage('reJoin')
  rejoin(@GetCurrentUserId() userId: string) {
    return this.gameService.rejoin(userId);
  }

  @SubscribeMessage('refuseInvite')
  refuseGameInvite(
    @Body() challengerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.refuseInvite(client, challengerId);
  }

  @SubscribeMessage('createInvitationGame')
  createInvitationGame(
    @MessageBody('mode') mode: GameMode,
    @MessageBody('opponent') playerTwoId: string,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() playerOneId: string,
  ) {
    this.socketToId.set(client.id, playerOneId);
    return this.gameService.createInvitationGame(
      client,
      this.server,
      playerOneId,
      playerTwoId,
      mode,
    );
  }

  @SubscribeMessage('leaveWatch')
  leaveWatchGame(
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameService.leaveWatch(client, playerId);
  }

  @SubscribeMessage('watchGame')
  watchGame(
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameService.watch(client, playerId, this.server);
  }

  @SubscribeMessage('joinGame')
  async joinRoom(
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    const playerNumber = await this.gameService.join(
      client,
      id,
      this.server,
      mode,
    );
    if (playerNumber.playerNumber === 1)
      this.server.to(client.id).emit('gameJoined', playerNumber);
  }
}
