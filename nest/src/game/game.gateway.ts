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
	origin: "http://localhost:3000"
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
    if (id) this.gameService.leave(id, this.server);
  }

  @SubscribeMessage('reJoin')
  rejoin(
    @GetCurrentUserId() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.gameService.rejoin(userId);
    this.server.to(client.id).emit('tryRejoin', game);
    return game;
  }

  @SubscribeMessage('refuseInvite')
  refuseGameInvite(
    @Body() challengerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.refuseInvite(client, challengerId);
  }

  @SubscribeMessage('leaveWatch')
  leaveWatchGame(
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameService.leaveWatch(client, playerId);
  }

  // spectating still under tests
  @SubscribeMessage('watchGame')
  async watchGame(
    @MessageBody('playerId') playerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const playerNumber = await this.gameService.watch(
      client,
      playerId,
      this.server,
    );
    this.server.to(client.id).emit('gameJoined', playerNumber);
    return playerNumber;
  }

  @SubscribeMessage('joinGame')
  async joinRoom(
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
    @MessageBody('inviteGameId') inviteGameId?: string,
  ) {
    if (this.socketToId.has(client.id)) return;
    this.socketToId.set(client.id, id);
    try {
      this.gameService.join(client, id, this.server, mode, inviteGameId);
    } catch (err) {
      this.server.to(client.id).emit('gameJoinFail', err);
    }
  }

  @SubscribeMessage('createInvitationGame')
  async createInvitationGame(
    @MessageBody('mode') mode: GameMode,
    @MessageBody('opponent') playerTwoId: string,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() playerOneId: string,
  ) {
    this.socketToId.set(client.id, playerOneId);
    console.log(this.socketToId.get(client.id));
    console.log(this.socketToId.has(client.id));
    if (!this.socketToId.has(client.id)) return;
    const returnMessage = await this.gameService.createInvitationGame(
      client,
      this.server,
      playerOneId,
      playerTwoId,
      mode,
    );
    if (returnMessage === 'gameJoined')
      this.server.emit('gameJoined', { playerNumber: 1 });
    return returnMessage;
  }
}
