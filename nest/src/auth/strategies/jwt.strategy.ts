import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import * as process from 'process';
import { HandshakeRequest } from 'src/game/entities/game.entity';

export type JwtPayload = {
  sub: string;
  name: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    const extractJwtFromSocket = (handshake: HandshakeRequest) => {
      const authHeader = handshake.headers.authorization;
      if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
        return authHeader.split(' ')[1];
      }
      return null;
    };

    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJwtFromSocket,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}