import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import path = require('path');
import { Response } from 'express';
import * as fs from 'fs';
import {
  editFileName,
  imageFileFilter,
  maxSizeLimit,
} from './utils/upload-utils';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  public async findAll(@Res() res: Response) {
    return this.usersService.findAll(res);
  }

  @Get(':id')
  //   @UseGuards(JwtGuard)
  @ApiOkResponse({ type: UserEntity })
  public async findOne(@Param('id') id: string) {
    // + operator casts to a number
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'This username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'This user cant be updated',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  public async remove(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.remove(id, res);
  }

  @Post('upload/:name')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Upload profile picture',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileimages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: maxSizeLimit,
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile()
    file: any,
  ): Promise<Observable<unknown>> {
    const filename = await this.usersService.getFilename(id);
    const filePath = path.resolve(`./uploads/profileimages/${filename}`);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
    });

    this.usersService.setFilename(file.filename, id);
    return of({ imagePath: file.filename });
  }

  @Get('upload/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'File has been sent' })
  async getFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const filename = await this.usersService.getFilename(id);
      if (filename === null) {
        return res.send(null);
      }
      const filePath = path.resolve(`./uploads/profileimages/${filename}`);
      const image = fs.readFileSync(filePath);
      res.contentType('image/jpeg');
      return res.send(image);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error when trying to send the file',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Match controller
  @Post('get-user-matches-stats')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: UserEntity })
  getUserMatchesStats(
    @Res() res: Response,
    @Body() target: { userName: string },
  ) {
    return this.usersService.getUserMatchesStats(target.userName, res);
  }

  @Post('get-user-match-history')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: UserEntity })
  getUserMatchHistory(
    @Res() res: Response,
    @Body() target: { userNickname: string },
  ) {
    return this.usersService.getUserMatchHistory(target.userNickname, res);
  }

  @Get('get-leaderboard')
  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: UserEntity })
  getLeaderBoard(@Res() res: Response) {
    return this.usersService.getLeaderboard(res);
  }
}
