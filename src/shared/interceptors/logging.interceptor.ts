import {
  Injectable,
  Logger,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_ACTION');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const { method, url, user } = req;

        const userLabel = user
          ? `User: ${user.id} (Escola: ${user.schoolId ?? 'SaaS'})`
          : 'Public/Guest';

        const delay = Date.now() - now;

        this.logger.log(`${method} ${url} | ${userLabel} | +${delay}ms`);
      }),
    );
  }
}
