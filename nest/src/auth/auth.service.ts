import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../users/interface/jwt-user.interface';
import { Intra42User } from '../users/interface/intra42-user.interface';
import * as process from 'process';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  private async generateTokens(payload: JwtUser) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      // expiresIn: '15m', // TODO : William set in FE
    });
  }

  async signIn(user: Intra42User) {
    if (user == null) throw new BadRequestException('Unauthenticated');

    let foundUser = await this.userService.findByIntraId(user.providerId);
    if (foundUser == null) {
      foundUser = await this.registerUser(user);
    }
    return await this.coreSignIn({
      id: foundUser.id,
      intraId: foundUser.intraId,
    });
  }

  async bypassAuth(createUserDto: CreateUserDto) {
    let foundUser = await this.userService.findByIntraId(createUserDto.intraId);
    if (foundUser == null) {
      if (createUserDto.name === '') {
        throw new InternalServerErrorException(
          'Name of user to be created cannot be empty!',
        );
      }
      foundUser = await this.userService.create(createUserDto);
    }
    return await this.coreSignIn({
      id: foundUser.id,
      intraId: foundUser.intraId,
    });
  }

  private async coreSignIn(foundUser: { id: string; intraId: string }) {
    const tokens = await this.generateTokens({
      id: foundUser.id,
      intraId: foundUser.intraId,
    });

    await this.userService.set2FALogged(foundUser.id, false);

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

  async enable2FA(userId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(userId, 'TODO', secret);
    await this.userService.set2FA(userId, secret);

    return toDataURL(otpAuthUrl);
  }

  async disable2FA(userId: string) {
    await this.userService.set2FA(userId, null);
  }

  async validateSecondFactor(res: Response, userId: string, code: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.secondFactorEnabled || !user.secondFactorSecret) {
      return res.status(HttpStatus.UNAUTHORIZED);
    }

    if (
      !authenticator.verify({ token: code, secret: user.secondFactorSecret })
    ) {
      return res.status(HttpStatus.FORBIDDEN).send('Wrong Code !');
    }
    await this.userService.set2FALogged(userId, true);
    return res.status(HttpStatus.OK).send('2fa set successfully');
  }

  async logout(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('Unauthorized');
    await this.userService.set2FALogged(userId, false);
  }
}
