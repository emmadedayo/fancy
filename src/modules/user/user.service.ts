import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { BaseResponse } from '../../libs/response/base_response';
import {
  BankDetailsDto,
  BankValidatorDto,
  FollowerRequestDto,
  SubscriptionSettings,
  UpdateUserDto,
} from './dto/user.dto';
import { UserFollowerRepository } from './repositories/user_follower_repository';
import { PaginationDto } from '../../libs/pagination/pagination';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { PostRepository } from '../post/repos/post-repository';
import { SubscribeUserRepository } from '../subscription/repo/subscribe-user-repo';
import { SubscriptionStatus } from '../subscription/entities/user_subscription.entity';
import { UserSubscriptionSettingsRepository } from './repositories/user_subscription_settings.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    private readonly payStackService: PayStackService,
    private readonly postRepository: PostRepository,
    private readonly subscribeUserRepository: SubscribeUserRepository,
    private readonly userSubscriptionSettingsRepository: UserSubscriptionSettingsRepository,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findOne(
      { id: userId },
      { settings: true },
    );
    const countFollowers = await this.userFollowerRepository.countWhere({
      followingId: userId,
    });
    const countFollowing = await this.userFollowerRepository.countWhere({
      followerId: userId,
    });
    const totalPost = await this.postRepository.countWhere({ user_id: userId });
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

  async getUserById(userId: string) {
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
    const totalPost = await this.postRepository.countWhere({ user_id: userId });
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

  async getUserPosts(userId: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const posts = await this.postRepository.findPaginated(
      pageSize,
      currentPage,
      { userId },
      {},
      { images: true },
    );
    return BaseResponse.success(
      posts,
      'Posts fetched successfully',
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
    const check = await this.userRepository.findOne({ id: userId });
    if (!check) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    if (
      check.avatar ===
        'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg' ||
      check.avatar === null
    ) {
      return BaseResponse.error('1001', null, HttpStatus.BAD_REQUEST);
    }
    //check if user_docs is not empty or null
    if (check.user_docs === null) {
      return BaseResponse.error('1002', null, HttpStatus.BAD_REQUEST);
    }
    //check if user bio is not empty or null
    if (check.bio === null || check.bio === '') {
      return BaseResponse.error('1001', null, HttpStatus.BAD_REQUEST);
    }
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
    const columns = ['name', 'username']; // Customize columns to search
    const entityName = 'users';
    const users = await this.userRepository.searchWithOutPagination(
      data.keywords,
      columns,
      entityName,
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
      res['data'],
      'Bank code validated successfully',
      HttpStatus.OK,
    );
  }

  async updateBankDetails(userId: string, data: BankDetailsDto) {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const bank: Record<string, any> = {
      bank_name: data.bank_name,
      account_number: data.account_number,
      account_name: data.account_name,
      bank_code: data.bank_code,
    };
    await this.userRepository.update({ id: userId }, { user_docs: bank });
    return BaseResponse.success(
      null,
      'Bank details updated successfully',
      HttpStatus.OK,
    );
  }

  async makeAccountPrivate(userId: string) {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const newIsPrivateState = !user.is_private; // Toggle is_private
    await this.userRepository.update(
      { id: userId },
      { is_private: newIsPrivateState },
    );
    return BaseResponse.success(
      null,
      `Account ${newIsPrivateState ? 'made private' : 'made public'} successfully`,
      HttpStatus.OK,
    );
  }

  async isAccountAvailableForCall(userId: string) {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const newIsAvailableForCallState = !user.is_available_for_call; // Toggle is_available_for_call
    await this.userRepository.update(
      { id: userId },
      { is_available_for_call: newIsAvailableForCallState },
    );
    return BaseResponse.success(
      null,
      `Account ${newIsAvailableForCallState ? 'made available for call' : 'made unavailable for call'} successfully`,
      HttpStatus.OK,
    );
  }

  async updateSubscriptionSettings(userId: string, data: SubscriptionSettings) {
    const subscriptionSettings =
      await this.userSubscriptionSettingsRepository.findOne({
        userId: userId,
      });
    if (subscriptionSettings) {
      await this.userSubscriptionSettingsRepository.update(
        { userId: userId },
        data,
      );
    } else {
      await this.userSubscriptionSettingsRepository.save(data);
    }

    return BaseResponse.success(
      null,
      `Subscription settings updated successfully`,
      HttpStatus.OK,
    );
  }
}
