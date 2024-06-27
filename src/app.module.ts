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
import Redis from 'ioredis';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        return {
          createClient: (type) => {
            switch (type) {
              case 'client':
                return new Redis(redisUrl);
              case 'subscriber':
                return new Redis(redisUrl, {
                  enableReadyCheck: false,
                  maxRetriesPerRequest: null,
                });
              case 'bclient':
                return new Redis(redisUrl, {
                  enableReadyCheck: false,
                  maxRetriesPerRequest: null,
                });
              default:
                throw new Error('Unexpected connection type: ' + type);
            }
          },
        };
      },
      inject: [ConfigService],
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
