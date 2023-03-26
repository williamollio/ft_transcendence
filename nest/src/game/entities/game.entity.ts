import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GameService } from '../game.service';
import { Server } from 'socket.io';

// To Manuel to check if this is correct
export interface HandshakeRequest extends Request {
  handshake: { auth: { token: string } };
}

export interface TwoFaRequest extends Request {
  cookies: { temporaryToken: string };
}

export interface JwtRequest extends Request {
  cookies: { jwtToken: string };
}
// -------------------------------------------

export enum UserConnectionStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  PLAYING = 'PLAYING',
}

export interface FrontendUser {
  id: string;
  filename: string; // is this needed?
  name: string;
  eloScore: number;
  twoFactorAuthenticationSet: boolean; // Manuel check this please
}
/*
Overall explanation:
MAYHEM: This mode is a bit more chaotic and unpredictable than "CLASSIC".
When the ball collides with the player's paddle in this mode, the horizontal
direction of the ball can change based on the current speed and direction
of the ball. If the current direction is positive, the speed of the ball is
set to a fixed value of 5, and the horizontal direction of the ball is set
to the value of the 5th element in the "speeds" array of the "gameConstants" property.
If the current direction is negative, the horizontal direction of the ball is
set to the negative of its current direction, and the speed of the ball is
increased by setting the horizontal direction of the ball to the value of the
"speeds" array at index equal to the current value of the "speed" property of
the "gameConstants" object.

Technical note:
MAYHEM is a game mode where the ball is moving faster and faster.
If the direction is positive, the method sets the speed of the ball to
a fixed value of 5, and sets the horizontal direction of the ball to the
value of the 5th element in the "speeds" array of the "gameConstants" property.
If the direction is negative, the method sets the horizontal direction of
the ball to the negative of its current direction, and increases the speed
of the ball by setting the horizontal direction of the ball to the value of
the "speeds" array at index equal to the current value of the "speed" property
of the "gameConstants" object.
*/

/*
Overall explanation:
CLASSIC: This mode is a bit more straightforward and predictable than "MAYHEM".
When the ball collides with the player's paddle in this mode, the horizontal
direction of the ball is simply reversed, and the speed of the ball is increased
by setting the horizontal direction of the ball to the value of the "speeds" array
at index equal to the current value of the "speed" property of the "gameConstants"
object.

Technical note:
The "CLASSIC" mode is the default mode of the game.
If the mode is "CLASSIC", the method sets the horizontal direction of the
ball to the negative of its current direction, and increases the speed of
the ball by setting the horizontal direction of the ball to the value of the
"speeds" array at index equal to the current value of the "speed" property of
the "gameConstants" object.
*/

export enum GameMode {
  CLASSIC = 'CLASSIC',
  MAYHEM = 'MAYHEM',
}
const generateRandomNumber = (min: number, max: number) => {
  return 5; //Math.floor(Math.random() * (max - min + 1)) + min;
};

export class DoubleKeyMap {
  playerMap = new Map<string, Game>();
  size = 0;

  getGame(playerId: string) {
    const game = this.playerMap.get(playerId);
    if (game !== undefined) {
      return game;
    }
    return null;
  }

  rejoinGame(playerId: string) {
    const game: Game | undefined = this.playerMap.get(playerId);
    if (game !== undefined) {
      return game;
    }
    return null;
  }
  /*
  So, this code is defining a function called matchPlayer that takes in
  a parameter called player2Id, which is a string that represents the ID
  of the second player in a game. The purpose of this function is to match
  up two players in a game.
  */
  matchPlayer(player2Id: string) {
    for (const [_, game] of this.playerMap) {
      if (game.p2id === undefined && _) {
        // the above is ugly but a linting rule is forcing me to add it
        game.p2id = player2Id;
        this.playerMap.set(player2Id, game);
        return game;
      }
    }
    return null;
  }
  setPlayer1(player1Id: string, game: Game) {
    game.p1id = player1Id;
    game.p2id = undefined;
    this.playerMap.set(player1Id, game);
    this.size++;
  }

  setPlayer2(player2Id: string, game: Game) {
    game.p2id = player2Id;
    this.playerMap.set(player2Id, game);
  }

  // Remove a player from the game by deleting them from the playerMap object
  delete(userId: string) {
    const game = this.playerMap.get(userId);
    if (game?.p1id === userId && game.p2id) {
      this.playerMap.delete(game.p2id);
    } else if (game?.p1id) {
      this.playerMap.delete(game.p1id);
    }
    this.playerMap.delete(userId);
    this.size--;
  }
}

export class Game {
  constructor(mode: GameMode) {
    this.status = Status.PENDING;
    this.gameRoomId = this.makeid(5);
    this.status = Status.PENDING;
    this.mode = mode;
  }
  // those are the constants that are used in the game (Henric can adjust them)
  gameConstants = {
    relativeGameWidth: 600,
    relativeMiddleX: 300,
    relativeGameHeight: 450,
    relativeMiddleY: 225,
    player1PaddlePosX: 30,
    player2PaddlePosX: 570,
    paddleWidth: 20,
    ballHeight: 30,
    maxSpeed: 0,
    speed: 0,
    speeds: [5], //[7, 8, 10, 12, 14, 15, 20],
  };
  gameRoomId: string;
  p1id: string | undefined = undefined;
  p2id: string | undefined = undefined;
  status: Status;
  dirx = this.gameConstants.speeds[0];
  diry = 0.0;
  p1y = 225;
  p2y = 225;
  bx = 300;
  by = 225;
  p1s = 0;
  p2s = 0;
  paddleSize = 100;
  mode: GameMode = GameMode.CLASSIC;

  // Full ball movement logic (moves the ball during the game, and
  // handles collisions with the game screen and player's paddles.
  // It also adjusts the speed and direction
  // of the ball based on the current game mode and the direction of the ball)
  detectPaddleCollision(
    ballX: number,
    ballY: number,
    ballHeight: number,
    paddleX: number,
    paddleY: number,
    paddleSize: number,
  ): boolean {
    const isColliding =
      ballX === paddleX &&
      ballY + ballHeight >= paddleY - paddleSize / 2 &&
      ballY <= paddleY + paddleSize / 2;
    return isColliding;
  }

  // Classic Game reset
  resetBallForClassicMode(): void {
    const MIN_RANDOM_Y_SPEED = -5;
    const MAX_RANDOM_Y_SPEED = 5;
    this.dirx = this.gameConstants.speeds[(this.gameConstants.speed = 0)];
    this.bx = this.gameConstants.relativeMiddleX;
    this.by = this.gameConstants.relativeMiddleY;
    this.diry = generateRandomNumber(MIN_RANDOM_Y_SPEED, MAX_RANDOM_Y_SPEED);
  }

  //   moveBall(gameService: GameService, server: Server) {
  //     const {
  //       relativeGameWidth,
  //       relativeGameHeight,
  //       player1PaddlePosX,
  //       player2PaddlePosX,
  //       ballHeight,
  //       maxSpeed,
  //       speeds,
  //     } = this.gameConstants;

  //     if (this.by + ballHeight >= relativeGameHeight) { // bottom collision
  //       this.by = relativeGameHeight - ballHeight;
  //       this.diry = -this.diry;
  //     } else if (this.by <= 0) { // top collision
  //       this.by = 0;
  //       this.diry = -this.diry;
  //     }
  //     // player paddle collision
  //     if (this.detectPaddleCollision(this.bx, this.by, player1PaddlePosX, this.p1y, this.paddleSize, ballHeight)) {
  //       switch (this.mode) {
  //         case GameMode.MAYHEM: {
  //           if (this.dirx > 0) {
  //             if (this.gameConstants.speed < maxSpeed) {
  //               this.gameConstants.speed = 5;
  //               this.dirx = speeds[5];
  //             }
  //           } else {
  //             this.dirx = this.dirx * -1;
  //             if (this.gameConstants.speed < maxSpeed) {
  //               this.dirx = speeds[this.gameConstants.speed++];
  //             }
  //           }
  //           this.diry = (this.by - this.p1y) / 2;
  //           break;
  //         }
  //         case GameMode.CLASSIC: {
  //           this.dirx = this.dirx * -1;
  //           if (this.gameConstants.speed < maxSpeed) {
  //             this.dirx = speeds[this.gameConstants.speed++];
  //           }
  //           this.diry = (this.by - this.p1y) / 2;
  //           break;
  //         }
  //       }
  //     }
  //     else if (this.detectPaddleCollision(this.bx, this.by, player2PaddlePosX, this.p2y, this.paddleSize, ballHeight)) {
  //       switch (this.mode) {
  //         case GameMode.MAYHEM: {
  //           if (this.dirx < 0) {
  //             if (this.gameConstants.speed < maxSpeed) {
  //               this.gameConstants.speed = 5;
  //               this.dirx = -speeds[5];
  //             }
  //           } else {
  //             this.dirx = this.dirx * -1;
  //             if (this.gameConstants.speed < maxSpeed) {
  //               this.dirx = -speeds[this.gameConstants.speed++];
  //             }
  //           }
  //           this.diry = this.by - this.p2y;
  //           break;
  //         }
  //         case GameMode.CLASSIC: {
  //           this.dirx = this.dirx * -1;
  //           if (this.gameConstants.speed < maxSpeed) {
  //             this.dirx = -speeds[this.gameConstants.speed++];
  //           }
  //           this.diry = this.by - this.p2y;
  //           break;
  //         }
  //       }
  //     }

  //     const SCORE_LIMIT = 10;

  //     if (this.bx <= 0) {
  //       this.p2s += 1;
  //       if (this.p2s >= SCORE_LIMIT) {
  //         gameService.winGame(this, server);
  //       }
  //       switch (this.mode) {
  //         case GameMode.CLASSIC: {
  //           this.resetBallForClassicMode();
  //           break;
  //         }
  //         case GameMode.MAYHEM: {
  //           this.bx = 0;
  //           this.dirx = speeds[(this.gameConstants.speed = 1)];
  //           break;
  //         }
  //       }
  //     }

  //     if (this.bx >= relativeGameWidth) {
  //       this.p1s += 1;
  //       if (this.p1s >= SCORE_LIMIT) {
  //         gameService.winGame(this, server);
  //       }
  //       switch (this.mode) {
  //         case GameMode.CLASSIC: {
  //           this.resetBallForClassicMode();
  //           break;
  //         }
  //         case GameMode.MAYHEM: {
  //           this.bx = relativeGameWidth;
  //           this.dirx = -speeds[(this.gameConstants.speed = 1)];
  //           break;
  //         }
  //       }
  //     }

  //     this.bx += this.dirx;
  //     this.by += this.diry;
  //     return this;
  //   }

  moveBall(gameService: GameService, server: Server) {
    if (
      this.by + this.gameConstants.ballHeight / 2 >=
      this.gameConstants.relativeGameHeight
    ) {
      this.by =
        this.gameConstants.relativeGameHeight - this.gameConstants.ballHeight;
      this.diry = this.diry * -1;
    }
    if (this.by - this.gameConstants.ballHeight / 2 <= 0) {
      this.by = 0 + this.gameConstants.ballHeight / 2;
      this.diry = this.diry * -1;
    }
    if (
      this.bx - this.gameConstants.ballHeight / 2 ==
      this.gameConstants.player1PaddlePosX
    ) {
      if (
        this.by + this.gameConstants.ballHeight / 2 >=
          this.p1y - this.paddleSize / 2 - 3 &&
        this.by - this.gameConstants.ballHeight / 2 <=
          this.p1y + this.paddleSize / 2 + 3
      ) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx > 0) {
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                this.gameConstants.speed = 5;
                this.dirx = this.gameConstants.speeds[5];
              }
            } else {
              this.dirx = this.dirx * -1;
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                // this.dirx += this.gameConstants.speedIncrease;
                this.dirx =
                  this.gameConstants.speeds[this.gameConstants.speed++];
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            // if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
            // this.dirx += this.gameConstants.speedIncrease;
            // this.dirx = this.gameConstants.speeds[this.gameConstants.speed++];
            // }
            break;
          }
        }
        // this number stays magic because it actually is magic
        this.diry = (this.by - this.p1y) / 2;
      }
    }

    if (
      this.bx + this.gameConstants.ballHeight / 2 ==
      this.gameConstants.player2PaddlePosX
    ) {
      if (
        this.by + this.gameConstants.ballHeight / 2 >=
          this.p2y - this.paddleSize / 2 &&
        this.by - this.gameConstants.ballHeight / 2 <=
          this.p2y + this.paddleSize / 2
      ) {
        switch (this.mode) {
          case GameMode.MAYHEM: {
            if (this.dirx < 0) {
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                this.gameConstants.speed = 5;
                this.dirx = -this.gameConstants.speeds[5];
              }
            } else {
              this.dirx = this.dirx * -1;
              if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
                // this.dirx -= this.gameConstants.speedIncrease;
                this.dirx =
                  -this.gameConstants.speeds[this.gameConstants.speed++];
              }
            }
            break;
          }
          case GameMode.CLASSIC: {
            this.dirx = this.dirx * -1;
            // if (this.gameConstants.speed < this.gameConstants.maxSpeed) {
            //   // this.dirx -= this.gameConstants.speedIncrease;
            //   this.dirx =
            //     -this.gameConstants.speeds[this.gameConstants.speed++];
            // }
            break;
          }
        }
        this.diry = this.by - this.p2y;
      }
    }

    if (this.bx <= 0) {
      this.p2s += 1;
      if (this.p2s >= 10) {
        gameService.winGame(this, server);
      }
      switch (this.mode) {
        case GameMode.CLASSIC: {
          this.dirx = this.gameConstants.speeds[(this.gameConstants.speed = 0)];
          this.bx = this.gameConstants.relativeMiddleX;
          this.by = this.gameConstants.relativeMiddleY;
          this.diry = generateRandomNumber(-20, 20);
          break;
        }

        case GameMode.MAYHEM: {
          this.bx = 0;
          this.dirx = this.gameConstants.speeds[(this.gameConstants.speed = 1)];
          break;
        }
      }
    }

    if (this.bx >= this.gameConstants.relativeGameWidth) {
      this.p1s += 1;
      if (this.p1s >= 10) {
        gameService.winGame(this, server);
      }
      switch (this.mode) {
        case GameMode.CLASSIC: {
          // this.dirx = -this.gameConstants.initialSpeed;
          this.dirx =
            -this.gameConstants.speeds[(this.gameConstants.speed = 0)];
          this.bx = this.gameConstants.relativeMiddleX;
          this.by = this.gameConstants.relativeMiddleY;
          this.diry = generateRandomNumber(-20, 20);
          break;
        }
        case GameMode.MAYHEM: {
          this.bx = this.gameConstants.relativeGameWidth;
          this.dirx =
            -this.gameConstants.speeds[(this.gameConstants.speed = 1)];
          break;
        }
      }
    }

    this.bx += this.dirx;
    this.by += this.diry;
    return this;
  }

  // This is our random string generator for the id
  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // was gonna recalculate the paddle position here but the server was a bit slow
  // so better do it in the client as i showed in the sample
  movePaddle(player: number, pos: number) {
    if (player === 1) {
      this.p1y = pos;
    } else {
      this.p2y = pos;
    }
  }

  returnGameInfo() {
    return {
      p1y: this.p1y,
      p2y: this.p2y,
      bx: this.bx,
      by: this.by,
      p1s: this.p1s,
      p2s: this.p2s,
    };
  }

  computeElo(RA: number, RB: number) {
    const exponent = (RB - RA) / 400;
    const intermediary = Math.pow(10, exponent);
    const newElo: number = 1 / (1 + intermediary);
    return newElo;
  }

  async getUserElo(userId: string, prismaService: PrismaService) {
    try {
      const user = await prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          eloScore: true,
        },
      });
      if (user) return user.eloScore;
    } catch (error) {}
  }

  async updateUserElo(
    userId: string,
    newElo: number,
    prismaService: PrismaService,
  ) {
    await prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        eloScore: newElo,
      },
    });
  }

  computeExpectedElos(eloPlayer1: number, eloPlayer2: number) {
    const expectedElo1 = this.computeElo(eloPlayer1, eloPlayer2);
    const expectedElo2 = this.computeElo(eloPlayer2, eloPlayer1);
    return {
      expectedEloPlayer1: expectedElo1,
      expectedEloPlayer2: expectedElo2,
    };
  }

  // Winner is a boolean set to 1 if player 1 won, and zero if he lost
  async getNewElos(prismaService: PrismaService, winner: boolean) {
    const newElos: { eloPlayer1: number; eloPlayer2: number } = {
      eloPlayer1: 0,
      eloPlayer2: 0,
    };
    if (typeof this.p1id === 'string' && typeof this.p2id === 'string') {
      const eloPlayer1 = await this.getUserElo(this.p1id, prismaService);
      const eloPlayer2 = await this.getUserElo(this.p2id, prismaService);
      if (eloPlayer1 && eloPlayer2) {
        const expectedElos = this.computeExpectedElos(eloPlayer1, eloPlayer2);

        if (winner) {
          newElos.eloPlayer1 = Math.ceil(
            eloPlayer1 + 15 * (1 - expectedElos.expectedEloPlayer1),
          );
          newElos.eloPlayer2 = Math.ceil(
            eloPlayer2 + 15 * (0 - expectedElos.expectedEloPlayer2),
          );
        } else {
          newElos.eloPlayer1 = Math.ceil(
            eloPlayer1 + 15 * (0 - expectedElos.expectedEloPlayer1),
          );
          newElos.eloPlayer2 = Math.ceil(
            eloPlayer2 + 15 * (1 - expectedElos.expectedEloPlayer2),
          );
        }
        if (newElos.eloPlayer2 < 100) {
          newElos.eloPlayer2 = 100;
        }
        if (newElos.eloPlayer1 < 100) {
          newElos.eloPlayer2 = 100;
        }
        return newElos;
      }
      return null;
    }
  }

  async saveGameResults(prismaService: PrismaService) {
    if (this.p2id) {
      await prismaService.user.update({
        where: {
          id: this.p1id,
        },
        data: {
          playerOneMatch: {
            create: [
              {
                gameId: this.gameRoomId,
                p1s: this.p1s,
                p2s: this.p2s,
                playerTwoId: this.p2id,
              },
            ],
          },
        },
      });
    }

    const newElos = await this.getNewElos(prismaService, this.p1s >= 10);
    if (newElos && this.p1id && this.p2id) {
      await this.updateUserElo(this.p1id, newElos.eloPlayer1, prismaService);
      await this.updateUserElo(this.p2id, newElos.eloPlayer2, prismaService);
    }
  }
}

export enum Status {
  PLAYING = 'PLAYING',
  DONE = 'DONE',
  OVER = 'OVER',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
}
