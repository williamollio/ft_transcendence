import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public async getAuthURL(): Promise<string> {
    let url = 'https://api.intra.42.fr/oauth/authorize?';
    url += 'client_id=' + process.env.CLIENT_ID;
    url += '&redirect_uri=' + process.env.REDIRECT_URI;
    url += '&scope=public';
    return url;
  }
}
