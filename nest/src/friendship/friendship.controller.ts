import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Delete,
  Res,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags } from '@nestjs/swagger';
import { FriendDto } from './dto/friend.dto';
import { Response } from 'express';

@Controller('friendship')
@ApiTags('user-friendship')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Get('none/:id')
  getUsers(@Param('id') userId: string, @Res() res: Response) {
    return this.friendshipService.getNoFriendship(userId, res);
  }

  @Get('received/:id')
  getFriendshipsReceived(@Param('id') userId: string, @Res() res: Response) {
    return this.friendshipService.getFriendshipsReceived(userId, res);
  }

  @Get('requested/:id')
  getFriendshipRequested(@Param('id') userId: string, @Res() res: Response) {
    return this.friendshipService.getFriendshipRequested(userId, res);
  }

  @Get('accepted/:id')
  getFriendshipAccepted(@Param('id') userId: string, @Res() res: Response) {
    return this.friendshipService.getFriendshipAccepted(userId, res);
  }

  @Post('request/:id')
  requestFriendship(
    @Param('id') userId: string,
    @Body() friendDto: FriendDto,
    @Res() res: Response,
  ) {
    return this.friendshipService.createFriendship(userId, friendDto.id, res);
  }

  @Patch('accept/:id')
  acceptFriendship(
    @Param('id') userId: string,
    @Body() friendDto: FriendDto,
    @Res() res: Response,
  ) {
    return this.friendshipService.acceptFriendship(userId, friendDto.id, res);
  }

  @Delete('delete/:id')
  deleteFriendship(
    @Param('id') userId: string,
    @Body() friendDto: FriendDto,
    @Res() res: Response,
  ) {
    return this.friendshipService.deleteFriendship(userId, friendDto.id, res);
  }
}
