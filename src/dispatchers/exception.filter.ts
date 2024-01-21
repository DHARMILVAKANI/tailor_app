import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'src/utils/service-logger';
import { errorMessages } from '../common/error-messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    logger.error('exception filter', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    if (!exception.response) {
      return response.status(status).json({
        isError: true,
        message: errorMessages.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }

    if (exception.response.message) {
      return response.status(status).json({
        isError: true,
        message:
          +status === 403
            ? errorMessages.SESSION_EXPIRED
            : exception.response.message || errorMessages.INTERNAL_SERVER_ERROR,
        data: exception.response.data || {},
      });
    }

    return response.status(status).json({
      isError: true,
      message:
        +status === 403
          ? errorMessages.SESSION_EXPIRED
          : exception.response.message || errorMessages.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
}
