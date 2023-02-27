import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { FriendshipDto } from './dto/friendship.dto';

@Controller('friendship')
@ApiTags('user-friendship')
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post('request-friends')
  requestFriends(
    @GetCurrentUserId() userId: string,
    @Body() data: { friendshipDto: FriendshipDto[] },
  ) {
    return this.friendshipService.addFrienshipRequests(
      userId,
      data.friendshipDto,
    );
  }
}
