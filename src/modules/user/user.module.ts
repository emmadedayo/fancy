import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserWalletRepository } from './repositories/user_wallet.repository';
import { UserRepository } from './repositories/user.repository';
import { UserFollowerRepository } from './repositories/user_follower_repository';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { UserAdminService } from './user-admin.service';
import { PostModule } from '../post/post.module';
import { PostRepository } from "../post/repos/post-repository";

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
  ],
})
export class UserModule {}
