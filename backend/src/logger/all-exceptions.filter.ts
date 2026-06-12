import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createLogger } from './logger';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = createLogger(AllExceptionsFilter.name);

  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    ctx.getResponse<FastifyReply>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Error ? exception.message : 'Unexpected error';

    const errorPayload = {
      err: exception instanceof Error ? exception : undefined,
      requestId: request.id,
      method: request.method,
      url: request.url,
      route: request.routeOptions?.url,
      statusCode,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(errorPayload, errorMessage);
    } else {
      this.logger.warn(errorPayload, errorMessage);
    }

    super.catch(exception, host);
  }
}
