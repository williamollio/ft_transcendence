import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  gettry(): string {
    return 'Hello try!';
  }
  getHello(): string {
    return 'Hello World!';
  }
}
