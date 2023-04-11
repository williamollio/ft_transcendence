import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const extractJwtFromCookieWrapper = (req: any) => {
      return JwtRefreshStrategy.extractJwtFromCookie(req, 'refresh_token');
    };

    super({
      jwtFromRequest: extractJwtFromCookieWrapper,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  static extractJwtFromCookie = (req: any, tokenName: string) => {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies[tokenName];
    }
    return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  };

  validate(req: any, payload: any) {
    return payload;
  }
}
