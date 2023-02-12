import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../users/interface/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    interface UserRequest extends Request {
      user: JwtUser;
    }
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;
    return user.id;
  },
);
