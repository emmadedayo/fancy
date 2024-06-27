import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { BaseResponse } from '../../libs/response/base_response';
import {
  BankValidatorDto,
  FollowerRequestDto,
  UpdateUserDto,
} from './dto/user.dto';
import { UserFollowerRepository } from './repositories/user_follower_repository';
import { PaginationDto } from '../../libs/pagination/pagination';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { PostRepository } from '../post/repos/post-repository';
import { SubscribeUserRepository } from '../subscription/repo/subscribe-user-repo';
import { SubscriptionStatus } from '../subscription/entities/user_subscription.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    private readonly payStackService: PayStackService,
    private readonly postRepository: PostRepository,
    private readonly subscribeUserRepository: SubscribeUserRepository,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findOne(
      { id: userId },
      { wallet: true },
    );
    const countFollowers = await this.userFollowerRepository.countWhere({
      followingId: userId,
    });
    const countFollowing = await this.userFollowerRepository.countWhere({
      followerId: userId,
    });
    const totalPost = await this.postRepository.countWhere({ userId: userId });
    const subscription = await this.subscribeUserRepository.find([
      { status: SubscriptionStatus.ACTIVE, user_id: userId },
    ]);
    user['followers'] = countFollowers;
    user['following'] = countFollowing;
    user['total_post'] = totalPost;
    user['subscribed'] = subscription[0];
    return BaseResponse.success(
      user,
      'User fetched successfully',
      HttpStatus.OK,
    );
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await this.userRepository.findOne(
      { id: userId },
      { wallet: true },
    );
    Object.assign(user, data);
    await this.userRepository.update({ id: user.id }, data);
    return BaseResponse.success(
      user,
      'User updated successfully',
      HttpStatus.OK,
    );
  }

  async deleteUser(userId: string) {
    await this.userRepository.findOneAndUpdate(
      { id: userId },
      { is_active: false, deletedAt: new Date() },
    );
    return BaseResponse.success(
      null,
      'User deleted successfully',
      HttpStatus.OK,
    );
  }

  async requestCreator(userId: string) {
    await this.userRepository.findOneAndUpdate(
      { id: userId },
      { creator: 'pending' },
    );
    return BaseResponse.success(
      null,
      'Request sent successfully',
      HttpStatus.OK,
    );
  }

  async followerRequest(data: FollowerRequestDto, userId: string) {
    const user = await this.userRepository.findOne({ id: data.user_id });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    await this.userFollowerRepository.save({
      followingId: userId,
      followerId: data.user_id,
    });
    //Todo Create a job to send notification to the user
    return BaseResponse.success(
      null,
      'Follower request sent successfully',
      HttpStatus.OK,
    );
  }

  async acceptFollowerRequest(id: string, userId: string) {
    const user = await this.userFollowerRepository.findOne({ id: id });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    await this.userFollowerRepository.update(
      { id: id, followingId: userId },
      { isAccepted: true },
    );
    //Todo Create a job to send notification to the user
    return BaseResponse.success(
      null,
      'Follower request accepted successfully',
      HttpStatus.OK,
    );
  }

  async unfollowUser(id: string) {
    await this.userFollowerRepository.findOneAndDelete({
      id: id,
    });
    return BaseResponse.success(
      null,
      'User unfollowed successfully',
      HttpStatus.OK,
    );
  }

  async getFollowers(userId: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const isFollowers = data.type === 'followers';
    const whereCondition = isFollowers
      ? { followingId: userId }
      : { followerId: userId };
    const users = await this.userFollowerRepository.findPaginated(
      pageSize,
      currentPage,
      whereCondition,
      {},
      { follower: true, following: true },
    );
    const message = isFollowers
      ? 'Followers fetched successfully'
      : 'Following fetched successfully';
    return BaseResponse.success(users, message, HttpStatus.OK);
  }

  async searchUser(data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const columns = ['name', 'username']; // Customize columns to search
    const entityName = 'users';
    const users = await this.userRepository.search(
      data.keywords,
      columns,
      entityName,
      pageSize,
      currentPage,
    );
    return BaseResponse.success(
      users,
      'Users fetched successfully',
      HttpStatus.OK,
    );
  }

  async getBank() {
    const data = await this.payStackService.fetchBanks();
    return BaseResponse.success(
      data['data'],
      'Banks fetched successfully',
      HttpStatus.OK,
    );
  }

  async validateBank(data: BankValidatorDto) {
    const res = await this.payStackService.resolveAccountNumber(
      data.account_number,
      data.bank_code,
    );
    if (!res['status']) {
      return BaseResponse.error(
        'Invalid bank code',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    return BaseResponse.success(
      data['data'],
      'Bank code validated successfully',
      HttpStatus.OK,
    );
  }
}
