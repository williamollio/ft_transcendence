import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { loadProtobuf } from 'src/proto/protobuf';
import { SocketToUserIdStorage } from 'src/users/socketToUserIdStorage.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

const ProtoBufProvider = {
  provide: 'PROTOBUFROOT',
  useFactory: async () => {
    const protobufRoot = await loadProtobuf('src/proto/file.proto');
    return protobufRoot;
  },
};

@Module({
  providers: [
    GameGateway,
    GameService,
    ProtoBufProvider,
    SocketToUserIdStorage,
  ],
  imports: [PrismaModule],
})
export class GameModule {}
