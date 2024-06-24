import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../../config';
import { BullModule } from '@nestjs/bull';
import { UserRepository } from '../user/repositories/user.repository';
import { UserWalletRepository } from '../user/repositories/user_wallet.repository';
import { SendEmailConsumer } from './consumer/send-email.consumer';
import { FirebaseService } from '../../libs/notification/firebase/firebase.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.registerQueue({
      name: Config.CREATE_USER_QUEUE,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    UserWalletRepository,
    SendEmailConsumer,
  ],
})
export class AuthenticationModule {}
