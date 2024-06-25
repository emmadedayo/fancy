import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: any = exception.getResponse();
    const errors: ValidationError[] = responseBody.message;

    // Extract the first validation error message
    let firstErrorMessage = 'Validation failed';
    if (errors && errors.length > 0) {
      const constraints = errors[0].constraints;
      if (constraints) {
        firstErrorMessage = Object.values(constraints)[0];
      }
    }

    response.status(status).json({
      statusCode: status,
      message: firstErrorMessage,
    });
  }
}
