import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './common/config/config.service';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.getAppConfig();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // it option allows to transform payloads to be objects typed according to their DTO classes
      whitelist: true,
    }),
  );
  const port = appConfig.port;
  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);
  const swaggerConfig = configService.getSwaggerConfig();

  if (swaggerConfig.enabled) {
    // Generate Swagger OpenAPI document
    const options = new DocumentBuilder()
      .setOpenAPIVersion(swaggerConfig.openApiVersion)
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .addBearerAuth()
      .setVersion(swaggerConfig.version)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path, app, document);

    logger.log(
      `Swagger documentation available at http://localhost:${port}/${swaggerConfig.path}`,
    );
  }
  app.enableCors();

  // Explicitly specifying all interfaces
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
