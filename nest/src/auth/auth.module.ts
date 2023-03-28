import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Intra42Strategy } from './strategies/intra42.strategy';
import * as process from 'process';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { FullAuthStrategy } from './strategies/full-auth-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    Intra42Strategy,
    JwtRefreshStrategy,
    FullAuthStrategy,
  ],
})
export class AuthModule {}
