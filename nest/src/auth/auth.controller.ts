import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';

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
    const token = await this.authService.signIn(req.user);

    response.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    response.redirect('http://localhost:3000/profile');
  }
}
