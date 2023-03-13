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
import { FriendshipDto } from './dto/friendship.dto';

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
  requestFrienship(
    @Param('id') userId: string,
    @Body() friendshipDto: FriendshipDto,
  ) {
    return this.friendshipService.createFrienship(userId, friendshipDto.id);
  }

  @Patch('accept/:id')
  acceptFrienship(
    @Param('id') userId: string,
    @Body() friendshipDto: FriendshipDto,
  ) {
    return this.friendshipService.acceptFriendship(userId, friendshipDto.id);
  }

  @Patch('deny/:id')
  denyFrienship(
    @Param('id') userId: string,
    @Body() friendshipDto: FriendshipDto,
  ) {
    return this.friendshipService.denyFriendship(userId, friendshipDto.id);
  }
  @Delete('delete/:id')
  deleteFrienship(
    @Param('id') userId: string,
    @Body() friendshipDto: FriendshipDto,
  ) {
    return this.friendshipService.deleteFriendship(userId, friendshipDto.id);
  }
}
