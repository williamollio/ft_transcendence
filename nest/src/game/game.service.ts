import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Status, Game, DoubleKeyMap, GameMode } from './entities/game.entity';
import { Root } from 'protobufjs';
import { gameSocketToUserId } from './socketToUserIdStorage.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class GameService {
  GameMap = new DoubleKeyMap();

  gameInfo = this.protobuf.lookupType('userpackage.GameInfo');
  playerInfo = this.protobuf.lookupType('userpackage.PlayerInfo');
  buf: Buffer;

  constructor(
    @Inject('PROTOBUFROOT') private protobuf: Root,
    private prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  mutateGameStatus(game: Game, status: Status, server: Server) {
    game.status = status;
    if (status === Status.DONE && game.p1id) {
      this.GameMap.delete(game.p1id);
    }
    server.to(game.gameRoomId).emit('gameStatus', {
      gameId: game.gameRoomId,
      status: game.status,
      winner: '',
      player1id: game.p1id,
      player2id: game.p2id,
      player1score: game.p1s,
    });
  }

  refuseInvite(client: Socket, userId: string) {
    const challengerSocket = gameSocketToUserId.getFromUserId(userId);
    if (challengerSocket) {
      if (this.GameMap.getGame(userId)) {
        client.to(challengerSocket).emit('inviteRefused', 'invite refused');
      }
      try {
        const game = this.GameMap.getGame(userId);
        if (game) {
          this.deleteTimeout(game.gameRoomId);
        }
        this.GameMap.delete(userId);
      } catch (error) {}
    }
  }

  async leaveWatch(client: Socket, playerId: string) {
    const game = this.GameMap.getGame(playerId);
    if (game !== null) {
      await client.leave(game.gameRoomId);
    }
	client.emit("leftWatch");
  }
  /*
  Spectating mode logic:
  So basically the idea is that when a player joins a game, they are added to
  the "players" array of the game object. The ids(pl1 and pl2 ids) are saved so basically watching
  is simpling joining the the gameRoom fetching the Game object informations;
  we are keeping the track of the player one and two so they are the only ones
  that have direct access to the game object. The spectators are just watching
  the game and they are not part of the game object. Even though they are part of
  the gameRoom.
  For more informations check the DoubleKeyMap class in the game entity, we have there
  a Map<string, Game>() objet that is keeping track of the games and the players.
  */
  async watch(client: Socket, playerId: string, server: Server) {
    const game = this.GameMap.getGame(playerId);
    if (game !== null) {
      await client.join(game.gameRoomId);
      server.to(client.id).emit('gameStatus', {
        gameId: game.gameRoomId,
        status: game.status,
        winner: '',
        player1id: game.p1id,
        player2id: game.p2id,
        player1score: game.p1s,
      });
    }
    // if (playerId === game?.p1id) return { playerNumber: 1 };
    return { playerNumber: 0 };
  }

  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async join(
    client: Socket,
    userId: string,
    server: Server,
    mode: GameMode,
    inviteGameId?: string,
  ) {
    let game: Game | null;

    if (inviteGameId) {
      // Joining an invite-based game
      const inviteGame = this.GameMap.getGame(inviteGameId);
      if (!inviteGame) {
        throw new Error('Invalid game invitation');
      }
      if (inviteGame.p2id !== userId) {
        throw new Error('Game is already full');
      }
      game = inviteGame;
      game.p2id = userId;
      await client.join(game.gameRoomId);
      server.to(client.id).emit('gameJoined', { playerNumber: 2 });
      await this.sleep(5000);
      this.mutateGameStatus(game, Status.PLAYING, server);
      this.addInterval(game.gameRoomId, userId, 30, server);
      return;
    } else {
      // Joining a random game
      if (this.GameMap.size === 0) {
        game = this.createGame(userId, mode);
        await client.join(game.gameRoomId);
        server.to(client.id).emit('gameJoined', { playerNumber: 1 });
        return;
      } else {
        if ((game = this.GameMap.rejoinGame(userId)) != null) {
          await client.join(game.gameRoomId);
          server
            .to(client.id)
            .emit(
              'gameJoined',
              game.p1id === userId ? { playerNumber: 1 } : { playerNumber: 2 },
            );
          if (game.status === Status.PAUSED) {
            await this.sleep(5000);
            this.mutateGameStatus(game, Status.PLAYING, server);
            this.deleteTimeout(game.gameRoomId);
            this.addInterval(game.gameRoomId, userId, 30, server);
          } else if (game.status === Status.PENDING && game.p2id === userId) {
            await this.sleep(5000);
            this.mutateGameStatus(game, Status.PLAYING, server);
            this.addInterval(game.gameRoomId, userId, 30, server);
          } else server.to(client.id).emit('gameStarting');
          return;
        }
        if ((game = this.GameMap.matchPlayer(userId))) {
          await client.join(game.gameRoomId);
          server.to(client.id).emit('gameJoined', { playerNumber: 2 });
          await this.sleep(5000);
          this.mutateGameStatus(game, Status.PLAYING, server);
          this.addInterval(game.gameRoomId, userId, 30, server);
          return;
        }
        game = this.createGame(userId, mode);
        await client.join(game.gameRoomId);
        server.to(client.id).emit('gameJoined', { playerNumber: 1 });
      }
    }
  }

  async createInvitationGame(
    initiatingSocket: Socket,
    server: Server,
    initiatingUserId: string,
    invitedUserId: string,
    gameMode: GameMode,
  ) {
    // Check if the invited user is already in a game
    if (this.GameMap.getGame(invitedUserId) !== null) {
      initiatingSocket.emit(
        'inviteRefused',
        'Your opponent is already in a game.',
      );
      return 'inviteFailed';
    }
    // Retrieve the details of the initiating user from the database
    let initiatingUser;
    try {
      initiatingUser = await this.prismaService.user.findUnique({
        where: { id: initiatingUserId },
        select: { id: true, name: true, eloScore: true, status: true },
      });
    } catch (error) {
      console.error('Error retrieving user data:', error);
      initiatingSocket.emit('inviteRefused', 'Failed to retrieve user data.');
      return 'inviteFailed';
    }

    // Check if invited user is online
    let invitedUser;
    try {
      invitedUser = await this.prismaService.user.findUnique({
        where: { id: invitedUserId },
        select: { status: true },
      });
    } catch (error) {
      console.error('Error retrieving user data:', error);
      initiatingSocket.emit('inviteRefused', 'Failed to retrieve user data.');
      return 'inviteFailed';
    }

    if (invitedUser?.status === UserStatus.OFFLINE) {
      initiatingSocket.emit('inviteRefused', 'Your opponent is offline.');
      return 'inviteFailed';
    }
    // Create a new game room and add the initiating user to it as player 1
    const game = this.createGame(initiatingUserId, gameMode, invitedUserId);
    await this.join(
      initiatingSocket,
      initiatingUserId,
      server,
      gameMode,
      undefined,
    );

    // Notify the invited user of the game invitation
    const invitedUserSocket = gameSocketToUserId.getFromUserId(invitedUserId);
    if (invitedUserSocket) {
      server
        .to(invitedUserSocket)
        .emit('invitedToGame', { initiatingUser: initiatingUser, game: game });
      return 'gameJoined';
    } else {
      console.error(`Failed to retrieve socket for user ${invitedUserId}.`);
      initiatingSocket.emit(
        'inviteRefused',
        'Failed to retrieve opponent data.',
      );
      return 'inviteFailed';
    }
  }

  rejoin(userId: string) {
    let game: Game | null;
    if ((game = this.GameMap.getGame(userId))) {
      return game.mode;
    }
    return null;
  }

  deleteTimeout(name: string) {
    try {
      this.schedulerRegistry.deleteTimeout(name);
    } catch (error) {}
  }

  addTimeout(
    name: string,
    milliseconds: number,
    server: Server,
    winnerId: string,
  ) {
    const callback = () => {
      const game = this.GameMap.getGame(winnerId);

      if (!game) return;
      if (game.status !== Status.PAUSED) this.deleteInterval(name);
      this.mutateGameStatus(game, Status.OVER, server);
      this.addWinningTimeout(5000, server, winnerId);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  addInvitationTimeout(
    name: string,
    server: Server,
    socketId: string,
    userId: string,
  ) {
    const callback = () => {
      this.GameMap.delete(userId);
      server
        .to(socketId)
        .emit('inviteRefused', 'Your opponent is to slow for you');
    };
    const timeoutInMs = 10000;
    const timeout = setTimeout(callback, timeoutInMs);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  addWinningTimeout(milliseconds: number, server: Server, winnerId: string) {
    const callback = () => {
      const game = this.GameMap.getGame(winnerId);
      if (!game) return;
      void game.saveGameResults(this.prismaService, winnerId);
      this.mutateGameStatus(game, Status.DONE, server);
      server.to(game.gameRoomId).emit('matchFinished', winnerId);
    };

    setTimeout(callback, milliseconds);
  }

  pause(id: string, server: Server) {
    const game = this.GameMap.getGame(id);
    if (
      game &&
      (game.status === Status.PAUSED || game.status === Status.PENDING)
    ) {
      if (game.status === Status.PAUSED) this.deleteTimeout(game.gameRoomId);
      this.GameMap.delete(id);
    } else if (game && game.status === Status.PLAYING) {
      if (game.p1id === id || game.p2id === id) {
        this.mutateGameStatus(game, Status.PAUSED, server);
        this.deleteInterval(game.gameRoomId);
        if (id === game.p1id && game.p2id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p2id);
        } else if (game.p1id) {
          this.addTimeout(game.gameRoomId, 10000, server, game.p1id);
        }
      }
    }
  }

  leave(id: string, server: Server) {
    const game = this.GameMap.getGame(id);
    if (
      game &&
      (game.status === Status.PAUSED || game.status === Status.PENDING)
    ) {
      if (game.status === Status.PAUSED) this.deleteTimeout(game.gameRoomId);
      this.GameMap.delete(id);
    } else if (game && game.status === Status.PLAYING) {
      if (game.p1id === id || game.p2id === id) {
        this.mutateGameStatus(game, Status.PAUSED, server);
        this.deleteInterval(game.gameRoomId);
        if (id === game.p1id && game.p2id) {
          this.addWinningTimeout(5000, server, game.p2id);
        } else if (game.p1id) {
          this.addWinningTimeout(5000, server, game.p1id);
        }
      }
    }
  }

  create(encoded: number, userId: string) {
    // const decoded = this.playerInfo.decode(encoded).toJSON();
    const y: number = encoded; //decoded.yPos;
    const game: Game | null = this.GameMap.getGame(userId);
    if (!game) return;
    if (game !== undefined) {
      if (game.p1id === userId) {
        game.movePaddle(1, y);
      } else {
        game.movePaddle(2, y);
      }
    }
  }

  moveBall(id: string, server: Server) {
    const game: Game | null = this.GameMap.getGame(id);
    if (!game) return;
    game.moveBall(this, server);
    return game.returnGameInfo();
  }

  createGame(p1: string, mode: GameMode, p2?: string) {
    const game = new Game(mode);
    this.GameMap.setPlayer1(p1, game);
    if (p2 !== undefined) {
      this.GameMap.setPlayer2(p2, game);
    }
    return game;
  }

  winGame(game: Game, server: Server) {
    this.deleteInterval(game.gameRoomId);
    this.mutateGameStatus(game, Status.OVER, server);
    if (game.p1s === 10 && game.p1id)
      this.addWinningTimeout(5000, server, game.p1id);
    else if (game.p2s === 10 && game.p2id)
      this.addWinningTimeout(5000, server, game.p2id);
  }

  addInterval(
    gameRoomId: string,
    userId: string,
    milliseconds: number,
    server: Server,
  ) {
    const callback = () => {
      const payload = this.moveBall(userId, server);
      if (!payload) return;
      //   this.gameInfo.verify(payload);
      //   const message = this.gameInfo.create(payload);
      //   const encoded = this.gameInfo.encode(message).finish();
      server.to(gameRoomId).volatile.timeout(5000).emit('GI', payload);
    };

    try {
      this.schedulerRegistry.getInterval(gameRoomId);
    } catch (err) {
      const interval = setInterval(callback, milliseconds);
      this.schedulerRegistry.addInterval(gameRoomId, interval);
    }
  }

  deleteInterval(name: string) {
    try {
      this.schedulerRegistry.deleteInterval(name);
    } catch (e) {}
  }

  getInterval(name: string) {
    const interval = this.schedulerRegistry.getInterval(name);
    return interval;
  }
}
