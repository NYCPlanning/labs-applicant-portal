import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

// We implement this to reshape the way http exception errors are 
// provided back to the client
// https://docs.nestjs.com/exception-filters#exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // this shapes the error responses into JSON:API
    // see https://jsonapi.org/format/#errors
    response
      .status(status)
      .json({
        errors: [exception],
      });
  }
}
