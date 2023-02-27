import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { FriendshipDto } from './dto/friendship.dto';

@Controller('friendship')
@ApiTags('user-friendship')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post('request-friends')
  addFrienshipRequests(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendshipDto: FriendshipDto[] },
  ) {
    return this.friendshipService.addFrienshipRequests(
      userId,
      data.friendshipDto,
    );
  }

  @Get('friendship-requests')
  getFrienshipRequests(@GetCurrentUserId() userId: string) {
    return this.friendshipService.getFrienshipRequests(userId);
  }

  @Get('friendship-accepted')
  getFrienshipAccepted(@GetCurrentUserId() userId: string) {
    return this.friendshipService.getFrienshipAccepted(userId);
  }

  @Patch('accept-friendship')
  acceptFrienshipRequest(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendId: string },
  ) {
    return this.friendshipService.acceptFrienshipRequest(userId, data.friendId);
  }

  @Patch('deny-friendship')
  denyFrienshipRequest(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendId: string },
  ) {
    return this.friendshipService.denyFrienshipRequest(userId, data.friendId);
  }
}
