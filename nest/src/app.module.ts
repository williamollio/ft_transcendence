import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserGateway } from './users/users.gateway';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ChannelModule],
  controllers: [AppController],
  providers: [UserGateway, AppService],
})
export class AppModule {}
