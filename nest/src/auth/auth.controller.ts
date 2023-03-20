import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IntraGuard } from './guards/intra.guard';
import * as process from 'process';
import { Intra42User } from '../users/interface/intra42-user.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FullAuthGuard } from './guards/full-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookieTokens(
    tokens: { accessToken: string; refreshToken: string },
    res: any,
  ) {
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });
  }

  @Get('intra42')
  @UseGuards(IntraGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('intra42/callback')
  @UseGuards(IntraGuard)
  async intraAuthCallback(@Req() req: any, @Res() response: any) {
    const tokens = await this.authService.signIn(req.user as Intra42User);

    this.setCookieTokens(tokens, response);

    response.redirect(`${process.env.PATH_TO_FRONTEND}/redirect`);
  }

  @Post('createBypassAuth')
  async bypassCreateAuthUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.bypassAuth(createUserDto);
  }

  @Get('bypassAuth/:intraId')
  async bypassGetAuthUser(@Param('intraId') intraId: string) {
    try {
      return await this.authService.bypassAuth({ name: '', intraId });
    } catch (e) {
      throw new UnauthorizedException('No such user!');
    }
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any, @Res() res: any) {
    await this.authService.logout(req.user.id);

    this.setCookieTokens({ accessToken: '', refreshToken: '' }, res);
    return HttpStatus.OK;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Req() req: any, @Res() res: any) {
    const userId = req.user.id;
    const refreshToken = req.cookies['refresh_token'];
    const tokens = this.authService.refreshTokens(userId, refreshToken);
    this.setCookieTokens(await tokens, res);
    return HttpStatus.OK;
  }

  @Get('2fa/activate')
  @UseGuards(JwtGuard)
  async enable2FA(@Req() request: any) {
    return await this.authService.enable2FA(request.user.id);
  }

  @Post('2fa/disable')
  @UseGuards(FullAuthGuard)
  async disable2FA(@Req() request: any) {
    await this.authService.disable2FA(request.user.id);
    return HttpStatus.OK;
  }

  @Post('2fa/validate')
  @UseGuards(JwtGuard)
  async validate2FA(@Req() request: any) {
    await this.authService.validateSecondFactor(request.user.id, request.body);
    return HttpStatus.OK;
  }
}
