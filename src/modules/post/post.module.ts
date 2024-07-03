import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostCommentRepository } from './repos/post-comment-repository';
import { PostImageRepository } from './repos/post-image-repository';
import { PostLikeRepository } from './repos/post-like-repository';
import { PostRepository } from './repos/post-repository';
import { PostUserTagRepository } from './repos/post-tags-repository';
import { PostViewRepository } from './repos/post-view-repository';
import { PostBooMarkRepository } from './repos/post-bookmark-repository';
import { UserFollowerRepository } from '../user/repositories/user_follower_repository';
import { BullModule } from '@nestjs/bull';
import { Config } from '../../config';
import { PostNotification } from './queue/post-notifiication-queue';
import { UserRepository } from '../user/repositories/user.repository';
import { PostLikeConsumerNotification } from './queue/post-like-consumer';
import { PostPaidRepository } from './repos/post-paid-repository';
import { UserWalletRepository } from "../user/repositories/user_wallet.repository";

@Module({
  imports: [
    BullModule.registerQueue({
      name: Config.SEND_POST_NOTIFICATION,
    }),
    BullModule.registerQueue({
      name: Config.SEND_LIKE_NOTIFICATION,
    }),
    BullModule.registerQueue({
      name: Config.SEND_COMMENT_NOTIFICATION,
    }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostCommentRepository,
    PostImageRepository,
    PostLikeRepository,
    PostPaidRepository,
    PostRepository,
    PostUserTagRepository,
    PostViewRepository,
    PostBooMarkRepository,
    UserFollowerRepository,
    PostNotification,
    PostLikeConsumerNotification,
    UserRepository,
    UserWalletRepository
  ],
})
export class PostModule {}
