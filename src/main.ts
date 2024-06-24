import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { Config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(Config.PORT || 4500);
  //print the url
  console.log(`Application is running on: ${await app.getUrl()}/`);
}
bootstrap().then(() => console.log('Application is running'));
