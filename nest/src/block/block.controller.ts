import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('add-blocked-user')
  addBlockedUser(
    @GetCurrentUserId() userId: string,
    @Body() data: { targetId: string },
  ) {
    return this.blockService.addBlockedUser(userId, data.targetId);
  }

  @Post('remove-blocked-user')
  removeBlockedUser(
    @GetCurrentUserId() userId: string,
    @Body() data: { targetId: string },
  ) {
    return this.blockService.removeBlockedUser(userId, data.targetId);
  }

  @Get('users-blocked-by-current-user')
  async usersBlockedByCurrentUser(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    const listBlockedUsers = await this.blockService.usersBlockedByCurrentUser(
      userId,
    );
    if (listBlockedUsers) return res.status(200).send(listBlockedUsers);
    else return res.status(500);
  }

  @Get('users-who-blocked-current-user')
  async usersWhoBlockedCurrentUser(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ) {
    const listUsersWhoBlocked =
      await this.blockService.usersWhoBlockedCurrentUser(userId);
    if (listUsersWhoBlocked) return res.status(200).send(listUsersWhoBlocked);
    else return res.status(500);
  }
}
