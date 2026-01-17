import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { success } from 'zod';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data, message) => ({
        success: true,
        message: 'Operacao realizada com sucesso',
        data: data || null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
