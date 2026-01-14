import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Access HTTP context
    const request = ctx.switchToHttp().getRequest();

    // request.user is inserted by Passport
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
