import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T> {
  message?: string;
  data?: T; // Make data optional
  isSuccessful: boolean;
  statusCode: HttpStatus;

  private constructor(
    isSuccessful: boolean,
    statusCode?: HttpStatus,
    message?: string,
    data?: T,
  ) {
    this.isSuccessful = isSuccessful;
    this.statusCode =
      statusCode || (isSuccessful ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    this.message = message;

    // Conditionally add data to the response
    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }

  static success<T>(
    data?: T,
    message?: string,
    statusCode?: HttpStatus,
  ): BaseResponse<T> {
    return new BaseResponse(true, statusCode, message, data);
  }

  static error<T>(
    message: string,
    data?: T,
    statusCode?: HttpStatus,
  ): BaseResponse<T> {
    return new BaseResponse(false, statusCode, message, data);
  }
}
