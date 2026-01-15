import {
  createParamDecorator,
  ForbiddenException,
  type ExecutionContext,
} from '@nestjs/common';

export const GetSchoolId = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || (!user.escolaId && user.role !== 'SUPERADMIN')) {
      throw new ForbiddenException('Usuario nao esta registado');
    }

    return user.escolaId;
  },
);
