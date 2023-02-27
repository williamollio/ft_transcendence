import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { FriendshipDto } from './dto/friendship.dto';
import { FriendshipStatus } from '@prisma/client';

@Controller('friendship')
@ApiTags('user-friendship')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Get('none')
  getUsers(@GetCurrentUserId() userId: string) {
    return this.friendshipService.getFrienships(userId, FriendshipStatus.NONE);
  }

  @Get('requested')
  getFrienshipRequests(@GetCurrentUserId() userId: string) {
    return this.friendshipService.getFrienships(
      userId,
      FriendshipStatus.REQUESTED,
    );
  }

  @Get('accepted')
  getFrienshipAccepted(@GetCurrentUserId() userId: string) {
    return this.friendshipService.getFrienships(
      userId,
      FriendshipStatus.ACCEPTED,
    );
  }

  @Patch('request')
  requestFrienship(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendshipDto: FriendshipDto[] },
  ) {
    return this.friendshipService.requestFrienship(userId, data.friendshipDto);
  }

  @Patch('accept')
  acceptFrienship(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendId: string },
  ) {
    return this.friendshipService.acceptFrienship(userId, data.friendId);
  }

  @Patch('deny')
  denyFrienship(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendId: string },
  ) {
    return this.friendshipService.denyFrienship(userId, data.friendId);
  }
}
