import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtUserDto } from '../users/dto/jwt-user.dto';
import { Intra42UserDto } from '../users/dto/intra42-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  generateJWT(payload: JwtUserDto) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: Intra42UserDto) {
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

  async registerUser(user: Intra42UserDto) {
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
