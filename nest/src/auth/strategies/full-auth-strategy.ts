import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import process from 'process';
import { JwtPayload, JwtStrategy } from './jwt.strategy';

@Injectable()
export class FullAuthStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private userService: UsersService) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: JwtStrategy.extractJwtFromSocket,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.id);

    if (user && (!user.secondFactorEnabled || user.secondFactorLogged)) {
      return {
        id: payload.id,
        intraId: payload.intraId,
      };
    }

    throw new UnauthorizedException('Log in to continue');
  }
}
