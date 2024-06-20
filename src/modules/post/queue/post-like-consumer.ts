import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Config } from '../../../config';
import { PostRepository } from '../repos/post-repository';
import { FirebaseService } from '../../../libs/notification/firebase/firebase.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserFollowerRepository } from '../../user/repositories/user_follower_repository';
import { In } from 'typeorm';
import { PostLikeRepository } from '../repos/post-like-repository';

@Processor(Config.SEND_LIKE_NOTIFICATION)
export class PostLikeConsumerNotification {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    private readonly userRepository: UserRepository,
    private readonly firebase: FirebaseService,
    private readonly postLikeRepository: PostLikeRepository,
  ) {}
  private readonly logger = new Logger(PostLikeConsumerNotification.name);
  @Process()
  async transcode(job) {
    this.logger.debug('Started processing post like notification queue');
    const { data } = job;
    //get the user that posted the post
    const post = await this.postRepository.findOneOrFail(
      { id: data.res.post_id },
      { user: true },
    );
    const likedBy = await this.userRepository.findOneOrFail({
      id: data.res.user_id,
    });
    //send a message to the user that posted the post that someone liked the post
    await this.firebase.sendNotification(
      [post.user.fcm_token], // Wrap the token in an array
      'Post Liked',
      'Your post has been liked by ' + likedBy.name,
    );
    // notify all users that has liked the post that someone liked the post as well
    const getPostLikes = await this.postLikeRepository.find(
      {
        postId: data.res.post_id,
      },
      { user: true },
    );
    const users = getPostLikes.map((like) => like.user);
    users.forEach((user) => {
      if (user.id !== likedBy.id) {
        this.firebase.sendNotification(
          [user.fcm_token], // Wrap the token in an array
          'Post Liked',
          likedBy.name + ' liked a post you liked',
        );
      }
    });
    this.logger.debug('Finished processing post like notification queue');
  }
}
