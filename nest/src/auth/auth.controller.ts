import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import * as process from 'process';
import { Intra42User } from '../users/interface/intra42-user.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('intra42')
  @UseGuards(IntraGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('intra42/callback')
  @UseGuards(IntraGuard)
  async intraAuthCallback(@Req() req: any, @Res() response: any) {
    const token = await this.authService.signIn(req.user as Intra42User);

    response.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    response.redirect(`${process.env.PATH_TO_FRONTEND}profile`);
  }
}
