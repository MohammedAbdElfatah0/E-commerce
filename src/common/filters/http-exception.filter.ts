import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // This can be string or object (BadRequestException can return both)
    const exceptionResponse = exception.getResponse();

    // Extract main message, error type, and validation details (if any)
    const message =
      typeof exceptionResponse === 'object' && (exceptionResponse as any).message
        ? (exceptionResponse as any).message
        : exception.message;

    const error =
      typeof exceptionResponse === 'object' && (exceptionResponse as any).errors
        ? (exceptionResponse as any).errors
        : (exceptionResponse as any).error;



    // Final structured response
    response.status(status).json({
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
