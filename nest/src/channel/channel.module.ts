import { Module } from '@nestjs/common';
import { BlockModule } from 'src/block/block.module';
import { UsersModule } from 'src/users/users.module';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  imports: [BlockModule, UsersModule, PrismaModule],
})
export class ChannelModule {}
