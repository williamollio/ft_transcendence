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

@WebSocketGateway(4444, {
  cors: {
    credentials: true,
  },
  parser: msgpack,
})
@UseGuards()
export class GameGateway {
  @WebSocketServer()
  server: Server;
  socketToId = new Map<string, string>();

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('PP')
  create(@MessageBody() encoded: Uint8Array, @GetCurrentUserId() id: string) {
    this.gameService.create(encoded, id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
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
    @Body() challenger: FrontendUser,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.refuseInvite(client, challenger.id);
  }

  @SubscribeMessage('createInvitationGame')
  createInvitationGame(
    @MessageBody('mode') mode: GameMode,
    @MessageBody('opponent') playerTwoId: GameMode,
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

  // @SubscribeMessage('leaveWatch')
  // leaveWatchGame(
  //   @MessageBody('playerId') playerId: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   return this.gameService.leaveWatch(client, playerId);
  // }


  // spectating still under tests
  // @SubscribeMessage('watchGame')
  // watchGame(
  //   @MessageBody('playerId') playerId: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   return this.gameService.watch(client, playerId, this.server);
  // }

  @SubscribeMessage('joinGame')
  joinRoom(
    @MessageBody('mode') mode: GameMode,
    @ConnectedSocket() client: Socket,
    @GetCurrentUserId() id: string,
  ) {
    this.socketToId.set(client.id, id);
    return this.gameService.join(client, id, this.server, mode);
  }
}