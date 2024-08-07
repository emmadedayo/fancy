import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserWalletRepository } from './repositories/user_wallet.repository';
import { UserRepository } from './repositories/user.repository';
import { UserFollowerRepository } from './repositories/user_follower_repository';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { UserAdminService } from './user-admin.service';
import { PostModule } from '../post/post.module';
import { PostRepository } from '../post/repos/post-repository';
import { SubscribeUserRepository } from '../subscription/repo/subscribe-user-repo';
import { UserSubscriptionSettingsRepository } from './repositories/user_subscription_settings.repository';
import { UserTransactionRepository } from './repositories/user_transaction.repository';

@Module({
  imports: [PostModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserAdminService,
    UserRepository,
    UserWalletRepository,
    UserFollowerRepository,
    PayStackService,
    PostRepository,
    SubscribeUserRepository,
    UserSubscriptionSettingsRepository,
    UserTransactionRepository,
  ],
})
export class UserModule {}
