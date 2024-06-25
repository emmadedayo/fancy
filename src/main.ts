import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { Config } from './config';
import { ValidationExceptionFilter } from './libs/interceptor/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(Config.PORT || 4500, '0.0.0.0');
  //print the url
  console.log(`Application is running on: ${await app.getUrl()}/`);
}
bootstrap().then(() => console.log('Application is running'));
