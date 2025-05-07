import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from 'src/@core/utils/constants';
import { JWTPayloadType } from 'src/@core/utils/types';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JWTPayloadType = request[CURRENT_USER_KEY];
    if (!user) {
      return null;
    }
    return user;
  },
);
