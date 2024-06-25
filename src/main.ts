import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { Config } from './config';
import { AllExceptionsFilter } from './libs/interceptor/validation-exception.filter';
import { classValidatorPipeInstance } from './libs/pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });
  //app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalPipes(classValidatorPipeInstance());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  await app.listen(Config.PORT || 4500, '0.0.0.0');
  //print the url
  console.log(`Application is running on: ${await app.getUrl()}/`);
}
bootstrap().then(() => console.log('Application is running'));
