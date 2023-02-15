import { HttpException, HttpStatus } from '@nestjs/common';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const imageFileFilter = (
  req: any,
  file: { originalname: string },
  callback: (arg0: HttpException | null, arg1?: any) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException('Only images are allowed', HttpStatus.NOT_ACCEPTABLE),
    );
  }
  callback(null, true);
};

export const editFileName = (
  req: any,
  file: { originalname: string },
  callback: (arg0: null, arg1: string) => void,
) => {
  const filename: string =
    path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;

  callback(null, `${filename}${extension}`);
};
