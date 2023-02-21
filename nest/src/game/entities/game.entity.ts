import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

export interface Position {
    x: number;
    y: number;
}

// neu one 

export interface HandshakeRequest extends Request {
    handshake?: { headers: { cookie: string } };
  }