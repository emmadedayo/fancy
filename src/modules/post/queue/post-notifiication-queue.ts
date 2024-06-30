import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Config } from '../../../config';
import { PostRepository } from '../repos/post-repository';
import { FirebaseService } from '../../../libs/notification/firebase/firebase.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserFollowerRepository } from '../../user/repositories/user_follower_repository';
import { In } from 'typeorm';

@Processor(Config.SEND_POST_NOTIFICATION)
export class PostNotification {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    private readonly userRepository: UserRepository,
    private readonly firebase: FirebaseService,
  ) {}
  private readonly logger = new Logger(PostNotification.name);
  @Process()
  async transcode(job) {
    this.logger.debug('Started processing post notification queue');
    const { data } = job;
    const post = await this.postRepository.findOneOrFail({ id: data.post.id });
    //get all user if friends from userRepository
    const followers = await this.userFollowerRepository.find({
      followingId: post.user_id,
    });
    const followerIds = followers.map((follower) => follower.followerId);
    //get all user from userRepository
    const users = await this.userRepository.find({
      id: In(followerIds),
    });
    //send notification to all users
    users.forEach((user) => {
      this.firebase.sendNotification(
        [user.fcm_token], // Wrap the token in an array
        'New Post',
        'A new post has been added',
      );
    });
    this.logger.debug('Finished processing post notification queue');
  }
}
