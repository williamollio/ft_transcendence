import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import * as process from 'process';
import { HandshakeRequest } from 'src/game/entities/game.entity';

export type JwtPayload = {
  id: string;
  intraId: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  static extractJwtFromSocket = (handshake: HandshakeRequest) => {
    if (handshake.handshake) {
      const authHeader = handshake.handshake.auth.token;

      if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
        return authHeader.split(' ')[1];
      }
      return null;
    } else return ExtractJwt.fromAuthHeaderAsBearerToken()(handshake as any);
  };

  constructor(private userService: UsersService) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: JwtStrategy.extractJwtFromSocket,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    return {
      id: payload.id,
      intraId: payload.intraId,
    };
  }
}
