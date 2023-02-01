import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Strategy } from 'passport-42';
import * as process from 'process';
import { Intra42UserDto } from '../../users/dto/intra42-user.dto';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/intra42/callback',
      scopes: [],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, name, emails /*, photos*/ } = profile;

    const user: Intra42UserDto = {
      provider: 'intra42',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      // picture: photos[0].value,
    };

    done(null, user);
  }
}
