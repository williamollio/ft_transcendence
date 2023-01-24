import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOkResponse()
  public async getURL(): Promise<string> {
    return await this.authService.getAuthURL();
  }
}
