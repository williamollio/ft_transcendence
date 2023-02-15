import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [PrismaModule],
  exports: [BlockService],
})
export class BlockModule {}
