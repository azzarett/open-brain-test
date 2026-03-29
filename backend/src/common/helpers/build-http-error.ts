import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants';

export const buildHttpError = (
  error_code: ErrorCode,
  status: HttpStatus,
  details?: unknown,
): HttpException => {
  return new HttpException(
    {
      error_code,
      ...(details ? { details } : {}),
    },
    status,
  );
};
