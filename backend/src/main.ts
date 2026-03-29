/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorCode } from './common/constants';
import { GlobalExceptionFilter } from './common/filters';
import { AppEnvironment, getAppConfig } from './config/app.config';

const bootstrap = async () => {
  const appConfig = getAppConfig();

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (validationErrors) => {
        const details = validationErrors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }));

        return new UnprocessableEntityException({
          error_code: ErrorCode.ValidationFailed,
          message: 'Validation failed',
          details,
        });
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (appConfig.environment !== AppEnvironment.Production) {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('Documentation of NestJS API')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();

    const options = {
      customCss: '.swagger-ui section.models { display: none; }',
    };

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, options);

    console.log('Swagger has been initialized');
  }

  await app.listen(appConfig.port);
};

bootstrap();
