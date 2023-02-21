import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

export interface Position {
    x: number;
    y: number;
}

export interface HandshakeRequest extends Request {
    handshake?: { headers: { cookie: string } };
  }