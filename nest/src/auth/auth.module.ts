import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Intra42Strategy } from './strategies/intra42.strategy';
import * as process from 'process';
import { FullAuthStrategy } from './strategies/full-auth-strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    Intra42Strategy,
    FullAuthStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
