import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtUser } from '../users/interface/jwt-user.interface';
import { Intra42User } from '../users/interface/intra42-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  generateJWT(payload: JwtUser) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: Intra42User) {
    if (user == null) throw new BadRequestException('Unauthenticated');

    const foundUser = await this.userService.findByIntraId(user.providerId);
    if (foundUser == null) {
      return this.registerUser(user);
    }

    return this.generateJWT({
      id: foundUser.id,
      intraId: foundUser.intraId,
    });
  }

  async registerUser(user: Intra42User) {
    try {
      const newUser = await this.userService.createFromIntra(user);
      return this.generateJWT({
        id: newUser.id,
        intraId: newUser.intraId,
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
