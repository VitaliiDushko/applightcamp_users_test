import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(
    message: string,
    public error?: any,
  ) {
    super(
      {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: message,
        details: error?.message || null,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
