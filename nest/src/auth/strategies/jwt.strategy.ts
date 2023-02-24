import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import * as process from 'process';

export type JwtPayload = {
  id: string;
  intraId: string;
};

export interface HandshakeRequest extends Request {
  handshake: { auth: {token: string}};
}

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(private userService: UsersService) {
//     const extractJwtFromCookie = (req: any) => {
//       let token = null;

//       if (req && req.cookies) {
//         token = req.cookies['access_token'];
//       }
//       return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
//     };

//     super({
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//       jwtFromRequest: extractJwtFromCookie,
//     });
//   }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    const extractJwtFromSocket = (handshake: HandshakeRequest) => {
      if (handshake.handshake) {
        const authHeader = handshake.handshake.auth.token;
        if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
          return authHeader.split(' ')[1];
        }
        return null;
      } else return ExtractJwt.fromAuthHeaderAsBearerToken()(handshake as any);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJwtFromSocket,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    return {
      id: payload.id,
      name: payload.intraId,
    };
  }
}

//   async validate(payload: JwtPayload) {
//     const user = await this.userService.findOne(payload.id);

//     if (!user) {
//       throw new UnauthorizedException('Please log in to continue');
//     }

//     return {
//       id: payload.id,
//       intraId: payload.intraId,
//     };
//   }
// }
