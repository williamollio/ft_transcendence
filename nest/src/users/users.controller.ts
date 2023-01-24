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
} from '@nestjs/common';
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
  ApiQuery,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of, throwError } from 'rxjs';
import path = require('path');
import { Response } from 'express';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  public async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  public async findOne(@Param('id') id: string) {
    // + operator casts to a number
    return this.usersService.findOne(+id);
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
      return await this.usersService.update(+id, updateUserDto);
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
  public async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload/:name')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(
    @Param('name') name: string,
    @UploadedFile() file: any,
  ): Observable<unknown> {
    console.log('name ' + name);
    this.usersService.setFilename(file.filename, name);
    return of({ imagePath: file.filename });
  }

  @Get('upload/:username')
  @ApiResponse({ status: HttpStatus.OK, description: 'File has been sent' })
  async getFile(@Param('username') username: string, @Res() res: Response) {
    try {
      const filename = await this.usersService.getFilename(username);
      if (!filename) {
        throwError;
      }
      const filePath = path.resolve(`./uploads/profileimages/${filename}`);
      res.sendFile(filePath);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error when trying to send the file',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
