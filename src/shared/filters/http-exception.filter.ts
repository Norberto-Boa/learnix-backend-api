import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let errorDetails = exceptionResponse;

    // Validation errors
    if (status === HttpStatus.BAD_REQUEST && exceptionResponse.fieldErrors) {
      errorDetails = {
        type: 'Erro de Validacao',
        fields: exceptionResponse.fieldErrors,
      };
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error: errorDetails,
      timestamp: new Date().toISOString(),
    });
  }
}
