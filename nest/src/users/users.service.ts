import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus, Match } from '@prisma/client';
import { Intra42User } from './interface/intra42-user.interface';
import { Response } from 'express';
import { MatchHistory } from 'src/game/interfaces/matchHistory.interface';
import { Stat } from 'src/game/interfaces/stats.interface';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// have to update this file and user response to display error

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async getFilename(id: string) {
    const User = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return User?.filename;
  }

  public async setFilename(filename: string, id: string) {
    await this.prisma.user.update({
      where: { id: id },
      data: {
        filename: filename,
      },
    });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const User = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          intraId: String(-1), // TODO : Needs to be adjusted
        },
      });

      this.updateFriendsList(User.id, createUserDto);

      return User;
    } catch (error) {
      throw error;
    }
  }

  public async createFromIntra(dto: Intra42User): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: `${dto.providerId}`,
          intraId: dto.providerId,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  public async findByIntraId(intraId: string) {
    return this.prisma.user.findUnique({
      where: { intraId: intraId },
      include: { friends: false },
    });
  }

  private async updateFriendsList(
    userId: string,
    userDto: CreateUserDto | UpdateUserDto,
  ) {
    const currentFriends = await this.prisma.user
      .findUnique({ where: { id: userId } })
      .friends();

    const newFriends = userDto.friends;

    const friendsToRemove = currentFriends?.filter(
      (friend) => !newFriends?.find((f) => f.id === friend.id),
    );

    const friendsToRemoveArr: { id: string }[] = [];
    if (friendsToRemove) {
      for (const friendToRemove of friendsToRemove) {
        friendsToRemoveArr.push({ id: friendToRemove.id });
      }
    }

    const friendsToAdd = newFriends?.filter(
      (friend) => !currentFriends?.find((f) => f.id === friend.id),
    );

    const friendsToAddArr: { id: string }[] = [];
    if (friendsToAdd) {
      for (const friendToAdd of friendsToAdd) {
        friendsToAddArr.push({ id: friendToAdd.id });
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: friendsToRemoveArr,
          connect: friendsToAddArr,
        },
      },
    });
  }

  public async findAll(res : Response) {
    // return this.prisma.user.findMany({ include: { friends: true } });
    try {
      const nicknames = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
      return res.status(200).send(nicknames);
    } catch (error) {
      return res.status(403).send();
    }
  }

  public async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { friends: true },
    });
  }

  public async updateRefreshToken(id: string, refreshToken: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { refreshToken },
      });
    } catch (e) {
      throw e;
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const User = await this.prisma.user.update({
        where: { id },
        data: { name: updateUserDto.name },
      });
      this.updateFriendsList(User.id, updateUserDto);
      return User;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: string, res : Response) {
    // return this.prisma.user.delete({ where: { id } });
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {}
    return res.send(204);
  }

  // channels api
  async updateConnectionStatus(userId: string, connectionStatus: UserStatus) {
    try {
      if (userId) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            status: connectionStatus,
          },
        });
      }
    } catch (error) {}
  }

  // change the status of the user to offline
  async logout(res: Response, userId: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status: UserStatus.OFFLINE,
        },
      });
      return res.status(200).clearCookie('jwtToken', { httpOnly: true }).send(); // maybe like this
    } catch (error) {
      return res.status(403).send();
    }
  }

  // channel invites
  async getChannelInvites(userId: string) {
    try {
      const invitesList = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          invites: {
            select: {
              id: true,
            },
          },
        },
      });
      if (invitesList) {
        const invites: { id: string }[] = [];
        for (const invitees of invitesList.invites) {
          invites.push(invitees);
        }
        return invites;
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }


    // Game shit 
    async getUserMatches(userName: string) {
      const matches = await this.prisma.user.findUnique({
        where: {
          name: userName,
        },
        select: {
          playerOneMatch: {},
          playerTwoMatch: {},
        },
      });
      if (matches) {
        const matchesList: Match[] = [];
  
        for (const match of matches.playerOneMatch) {
          matchesList.push(match);
        }
  
        for (const match of matches.playerTwoMatch) {
          matchesList.push(match);
        }
  
        matchesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return matchesList;
      }
      return null;
    }
  
    async getUserMatchesStats(userName: string, res: Response) {
      const user = await this.findOneFromuserName(userName);
      const ranking = await this.getUserRanking(userName);
      if (user && ranking) {
        const stats: Stat = {
          numberOfWin: 0,
          numberOfLoss: 0,
          ranking: ranking,
          eloScore: user.eloScore,
        };
  
        const matchesList = await this.getUserMatches(userName);
        if (matchesList) {
          for (const match of matchesList) {
            if (
              (match.playerOneId === user.id && match.p1s == 10) ||
              (match.playerTwoId === user.id && match.p2s == 10)
            )
              stats.numberOfWin++;
          }
          stats.numberOfLoss = matchesList.length - stats.numberOfWin;
          return res.status(200).send(stats);
        }
      }
    }

    async findOneFromuserName(userName: string): Promise<User | null> {
      return await this.prisma.user.findUnique({
        where: {
          name: userName,
        },
      });
    }

    async getUserInfo(userId: string): Promise<User | null> {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    }
  
    async getUserRanking(userName: string) {
      let userRank = '';
  
      const users = await this.prisma.user.findMany({
        orderBy: {
          eloScore: 'desc',
        },
      });
      for (let i = 0; i < users.length; i++) {
        if (users[i].name == userName) {
          const rank = i + 1;
          userRank = rank.toString() + '/' + users.length.toString();

          return userRank;
        }
      }
      return userRank;
    }

    // still have to implement the services for the history and the leaderboard
    // game won / game lost / points ???

    async getUserMatchHistory(userNickname: string, res: Response) {
      const matchesList = await this.getUserMatches(userNickname);
      const matchHistory: MatchHistory[] = [];
      const currentUser = await this.findOneFromuserName(userNickname);
      let opponent: User | null;
      let matchWon: boolean;
      let score: string;
  
      if (matchesList && currentUser) {
        try {
          for (const match of matchesList) {
            if (match.playerOneId === currentUser.id) {
              opponent = await this.getUserInfo(match.playerTwoId);
              score = match.p1s.toString() + '-' + match.p2s.toString();
              if (match.p1s == 10) matchWon = true;
              else matchWon = false;
            } else {
              opponent = await this.getUserInfo(match.playerOneId);
              score = match.p2s.toString() + '-' + match.p1s.toString();
              if (match.p2s == 10) matchWon = true;
              else matchWon = false;
            }
            if (opponent) {
              const imageOpponent = opponent.filename;
              matchHistory.push({
                id: match.gameId,
                imageCurrentUser: currentUser.filename,
                imageOpponent: imageOpponent,
                score: score,
                matchWon: matchWon,
              });
            }
          }
          return res.status(200).send(matchHistory);
        } catch (error) {
          throw new ForbiddenException(error);
        }
      }
      return res.status(500).send();
    }
  
    async getLeaderboard(res: Response) {
      try {
        const leaderboard = await this.prisma.user.findMany({
          take: 10,
          orderBy: {
            eloScore: 'desc',
          },
          select: {
            id: true,
            name: true,
            filename: true,
            eloScore: true,
          },
        });
        return res.status(200).send(leaderboard);
      } catch (error) {
        throw new ForbiddenException(error);
      }
    }
}
