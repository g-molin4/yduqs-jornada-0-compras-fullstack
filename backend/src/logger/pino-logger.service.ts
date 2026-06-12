import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'pino';
import { appLogger } from './logger';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: Logger = appLogger.child({
    context: 'NestApplication',
  });

  log(message: unknown, ...optionalParams: unknown[]) {
    this.write('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.write('trace', message, optionalParams);
  }

  fatal?(message: unknown, ...optionalParams: unknown[]) {
    this.write('fatal', message, optionalParams);
  }

  private write(
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    message: unknown,
    optionalParams: unknown[],
  ) {
    const [firstParam, ...remainingParams] = optionalParams;
    const context = typeof firstParam === 'string' ? firstParam : undefined;
    const data =
      context === undefined
        ? optionalParams
        : remainingParams.length === 1
          ? remainingParams[0]
          : remainingParams.length > 1
            ? remainingParams
            : undefined;

    if (message instanceof Error) {
      this.logger[level]({ err: message, context, data }, message.message);
      return;
    }

    if (typeof message === 'string') {
      this.logger[level]({ context, data }, message);
      return;
    }

    this.logger[level]({ context, data, payload: message }, 'Structured log');
  }
}
