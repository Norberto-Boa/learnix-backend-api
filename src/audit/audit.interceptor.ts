import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';
import { type Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_METADATA_KEY } from './audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

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
