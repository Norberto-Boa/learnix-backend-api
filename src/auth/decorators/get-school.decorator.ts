import {
  createParamDecorator,
  ForbiddenException,
  type ExecutionContext,
} from '@nestjs/common';

export const GetSchoolId = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || (!user.schoolId && user.role !== 'SUPERADMIN')) {
      throw new ForbiddenException(
        'Usuario nao esta registado em nenhuma escola',
      );
    }

    return user.schoolId;
  },
);
