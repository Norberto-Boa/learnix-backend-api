import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            )
          : winston.format.combine(
              winston.format.timestamp({
                format: 'HH:mm:ss',
              }),
              winston.format.colorize(),
              winston.format.printf(
                ({ timestamp, level, message, context }) => {
                  return `[${timestamp}] ${level}: [${context || 'Nest'}] ${message}`;
                },
              ),
            ),
    }),
  ],
});
