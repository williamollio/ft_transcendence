import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FullAuthGuard extends AuthGuard('jwt2fa') {}
