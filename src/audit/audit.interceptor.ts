import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { AuditService } from './audit.service';
import { type Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get('audit', context.getHandler());

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { user, body } = request;

    return next.handle().pipe(
      tap((result) => {
        if (!user) return;

        this.auditService.log({
          action: auditOptions.action,
          entity: auditOptions.entity,
          entityId: result?.id,
          userId: user.userId,
          schoolId: user.schoolId,
          newData: body,
        });
      }),
    );
  }
}
