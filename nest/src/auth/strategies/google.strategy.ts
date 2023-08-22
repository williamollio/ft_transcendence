import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'process';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAuthUser } from '../../users/interface/user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const user: OAuthUser = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName}`,
    };

    done(null, user);
  }
}
