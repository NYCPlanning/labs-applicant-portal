import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// response objects from HttpExceptions may be recursively
// nested to reflect a stack trace (each level is a layer
// in the stack). This flattens them out so that each response
// is a top-level item in the errors array.
export function unfoldedStackTrace(response, status) {
  const firstError = {
    code: response.code,
    title: response.title,
    detail: response.detail,
    meta: response.meta || {},
    status,
  };

  if (!response.response) {
    return [firstError];
  }

  return [firstError, ...unfoldedStackTrace(response.response, status)];
}

// We implement this to reshape the way http exception errors are
// provided back to the client
// https://docs.nestjs.com/exception-filters#exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const httpResponse = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // this shapes the error responses into JSON:API
    // see https://jsonapi.org/format/#errors
    httpResponse.status(status).json({
      errors: unfoldedStackTrace(errorResponse, status),
    });
  }
}
