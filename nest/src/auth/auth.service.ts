import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../users/interface/jwt-user.interface';
import { Intra42User } from '../users/interface/intra42-user.interface';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  private async generateTokens(payload: JwtUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(user: Intra42User) {
    if (user == null) throw new BadRequestException('Unauthenticated');

    let foundUser = await this.userService.findByIntraId(user.providerId);
    if (foundUser == null) {
      foundUser = await this.registerUser(user);
    }

    const tokens = await this.generateTokens({
      id: foundUser.id,
      intraId: foundUser.intraId,
    });

    const _ = this.userService.updateRefreshToken(
      foundUser.id,
      tokens.refreshToken, // FIXME: Hash the refresh token
    );

    return tokens;
  }

  async registerUser(user: Intra42User) {
    try {
      return await this.userService.createFromIntra(user);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
