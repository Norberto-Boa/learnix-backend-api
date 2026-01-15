import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './config/swagger.config';
import { loggerConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });

  setupSwagger(app);
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 API rodando em: http://localhost:3001/api`);
}
bootstrap();
