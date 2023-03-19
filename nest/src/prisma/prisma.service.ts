// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // necessary initialization tasks when the module is initialized
  // async onModuleInit() {
  //   await this.$connect();
  // }

  // async onModuleDestroy() {
  //   await this.$disconnect();
  // }

  // ensure the application shuts down gracefully
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
