import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../users/interface/jwt-user.interface';
import { Intra42User } from '../users/interface/intra42-user.interface';
import * as process from 'process';
import * as argon2 from 'argon2';

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
        // expiresIn: '15m', // TODO : William set in FE
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        // expiresIn: '7d', // TODO : William set in FE
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

    await this.userService.updateRefreshToken(
      foundUser.id,
	  tokens.refreshToken,
    //   await argon2.hash(tokens.refreshToken),
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');
    if (!(await argon2.verify(user.refreshToken, refreshToken)))
      throw new ForbiddenException('Access denied');
    const tokens = await this.generateTokens({
      id: user.id,
      intraId: user.intraId,
    });
    await this.userService.updateRefreshToken(
      user.id,
      await argon2.hash(tokens.refreshToken),
    );
    return tokens;
  }

  async logout(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('Unauthorized');
    await this.userService.updateRefreshToken(user.id, '');
  }
}
