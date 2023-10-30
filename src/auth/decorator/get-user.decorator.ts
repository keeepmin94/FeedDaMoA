import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

// 요청에서 헤더에 있는 JWT 토큰이 return 하는 user 객체를 가져옵니다.
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
