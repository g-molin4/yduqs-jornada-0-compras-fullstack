import pino, { Logger, LoggerOptions } from 'pino';

const loggerOptions: LoggerOptions = {
  enabled: process.env.NODE_ENV !== 'test',
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (level) => ({ level }),
  },
  serializers: {
    req: (request: {
      id?: string;
      method?: string;
      url?: string;
      routeOptions?: { url?: string };
      ip?: string;
    }) => ({
      id: request.id,
      method: request.method,
      url: request.url,
      route: request.routeOptions?.url,
      remoteAddress: request.ip,
    }),
    res: (reply: { statusCode?: number }) => ({
      statusCode: reply.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    remove: true,
  },
};

export const appLogger = pino(loggerOptions);

export function createLogger(context: string): Logger {
  return appLogger.child({ context });
}
