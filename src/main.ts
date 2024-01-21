import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envConfig } from './config/env';
import helmet from 'helmet';
import { ValidationPipe } from './utils/validation.pipe';
import { AllExceptionsFilter } from './dispatchers/exception.filter';
import { ResponseInterceptor } from './dispatchers/response.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const appPort = envConfig.app.port;

  app.use(helmet.frameguard());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Tailor App backend Service')
    .setDescription('Tailor web backend Service APIs')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     description: 'This is Bearer auth',
    //     scheme: 'bearer',
    //     bearerFormat: 'Token',
    //   },
    //   'Authorization',
    // )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(appPort);
  logger.log(`🚀 Application running on port ${appPort}`);
}
bootstrap();
