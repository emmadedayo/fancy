import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationException } from '../pipe/error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case exception instanceof ValidationException: {
        const exceptionResponse = exception.getResponse();
        let errorMessage = '';
        // Assuming exceptionResponse is an array of validation error objects
        if (Array.isArray(exceptionResponse) && exceptionResponse.length > 0) {
          errorMessage = exceptionResponse[0].message;
        } else if (typeof exceptionResponse === 'string') {
          errorMessage = exceptionResponse;
        } else {
          errorMessage = 'Validation error occurred'; // Default message if structure is unexpected
        }
        const responseBody = {
          success: false,
          message: errorMessage,
          statusCode: HttpStatus.BAD_REQUEST,
        };
        return httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
      }

      default: {
        const responseBody = {
          success: false,
          message: exception.message,
          statusCode: HttpStatus.BAD_REQUEST,
          stack: exception.stack,
        };
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
      }
    }
  }
}
