import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  generateJWT(payload: any) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: CreateUserDto) {
    if (user == null) throw new BadRequestException('Unauthenticated');

    const foundUser = await this.userService.findByName(user.name);
    if (foundUser == null) {
      return this.registerUser(user);
    }

    return this.generateJWT({
      sub: foundUser.id,
      name: foundUser.name,
    });
  }

  async registerUser(user: CreateUserDto) {
    try {
      const newUser = await this.userService.create(user);
      return this.generateJWT({
        sub: newUser.id,
        name: newUser.name,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
