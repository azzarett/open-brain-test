import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        response.status(status).json({
          statusCode: status,
          error_code: this.defaultErrorCodeByStatus(status),
          message: exceptionResponse,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        return;
      }

      const normalized = exceptionResponse as Record<string, unknown>;
      response.status(status).json({
        statusCode: status,
        error_code:
          (normalized.error_code as string) ??
          this.defaultErrorCodeByStatus(status),
        ...(normalized.message ? { message: normalized.message } : {}),
        ...(normalized.details ? { details: normalized.details } : {}),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error_code: ErrorCode.InternalServerError,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private defaultErrorCodeByStatus(status: number): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ErrorCode.ValidationFailed;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.Unauthorized;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.Forbidden;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NotFound;
      case HttpStatus.CONFLICT:
        return ErrorCode.Conflict;
      default:
        return ErrorCode.InternalServerError;
    }
  }
}
