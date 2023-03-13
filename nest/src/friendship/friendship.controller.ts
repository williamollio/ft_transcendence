import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags } from '@nestjs/swagger';
// import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { FriendDto } from './dto/friend.dto';

@Controller('friendship')
@ApiTags('user-friendship')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  // Add @GetCurrentUserId()
  @Get('none/:id')
  getUsers(@Param('id') userId: string) {
    return this.friendshipService.getNoFriendship(userId);
  }

  @Get('requests-received/:id')
  getFrienshipsRequestsReceived(@Param('id') userId: string) {
    return this.friendshipService.getFrienshipsRequestsReceived(userId);
  }

  @Get('requests/:id')
  getFrienshipRequests(@Param('id') userId: string) {
    return this.friendshipService.getFrienshipRequests(userId);
  }

  @Get('accepted/:id')
  getFrienshipAccepted(@Param('id') userId: string) {
    return this.friendshipService.getFrienshipAccepted(userId);
  }

  @Post('request/:id')
  requestFrienship(@Param('id') userId: string, @Body() friendDto: FriendDto) {
    return this.friendshipService.createFrienship(userId, friendDto.id);
  }

  @Patch('accept/:id')
  acceptFrienship(@Param('id') userId: string, @Body() friendDto: FriendDto) {
    return this.friendshipService.acceptFriendship(userId, friendDto.id);
  }

  @Delete('delete/:id')
  deleteFrienship(@Param('id') userId: string, @Body() friendDto: FriendDto) {
    return this.friendshipService.deleteFriendship(userId, friendDto.id);
  }
}
