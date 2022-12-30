import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public async getAuthURL(): Promise<string> {
    // TODO: Create URI from .env file
    return 'TODO';
  }
}
