import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'process';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Intra42User } from '../../users/interface/intra42-user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN_IP}/api/auth/google/callback`,
      scopes: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const user: Intra42User = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
    };

    done(null, user);
  }
}
