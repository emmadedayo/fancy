import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { DatabaseModule } from './libs/db/DatabaseModule';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/authentication/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './modules/post/post.module';
import { StoryModule } from './modules/story/story.module';
import { ImageUploadModule } from './modules/image-upload/image-upload.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { FundraisingModule } from './modules/fundraising/fundraising.module';
import { FirebaseModule } from './libs/notification/firebase/firebase.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: process.env.REDIS_URL,
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 500,
    }),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Get secret from .env or config
        signOptions: { expiresIn: '1d' }, // Example token expiration time
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UserModule,
    PostModule,
    StoryModule,
    ImageUploadModule,
    SubscriptionModule,
    FundraisingModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
