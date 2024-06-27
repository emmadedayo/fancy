import { HttpStatus, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './repo/subscription-repo';
import { SubscribeUserRepository } from './repo/subscribe-user-repo';
import {
  CreateSubscriptionDto,
  SubscribeUserDto,
} from './dto/subscription.dto';
import { BaseResponse } from '../../libs/response/base_response';
import { SubscriptionEntity } from './entities/subscription.entity';
import {
  SubscribeUserEntity,
  SubscriptionStatus,
} from './entities/user_subscription.entity';
import { calculateSubscriptionEndDate } from '../../libs/common/helpers/utils';
import { PaginationDto } from '../../libs/pagination/pagination';
import { MoreThanOrEqual } from 'typeorm';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { PaymentType } from '../../libs/payment/payment-type.enum';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscribeUserRepository: SubscribeUserRepository,
    private readonly payStackService: PayStackService,
  ) {}

  async createSubscription(data: CreateSubscriptionDto) {
    await this.subscriptionRepository.save(<SubscriptionEntity>data);
    return BaseResponse.success(
      null,
      'Subscription created successfully',
      HttpStatus.CREATED,
    );
  }

  async getAllSubscription() {
    const subscriptions = await this.subscriptionRepository.fetchAll();
    return BaseResponse.success(
      subscriptions,
      'Subscription fetched successfully',
    );
  }

  async getSubscriptionById(id: string) {
    const subscription = await this.subscriptionRepository.findOne({ id });
    if (!subscription) {
      return BaseResponse.error('Subscription not found', HttpStatus.NOT_FOUND);
    }
    return BaseResponse.success(
      subscription,
      'Subscription fetched successfully',
    );
  }

  async deleteSubscription(id: string) {
    const subscription = await this.subscriptionRepository.findOne({ id });
    if (!subscription) {
      return BaseResponse.error('Subscription not found', HttpStatus.NOT_FOUND);
    }
    await this.subscriptionRepository.findOneAndUpdate(
      { id },
      { deleted_at: new Date() },
    );
    return BaseResponse.success(
      null,
      'Subscription deleted successfully',
      HttpStatus.OK,
    );
  }

  async updateSubscription(id: string, data: CreateSubscriptionDto) {
    const subscription = await this.subscriptionRepository.findOne({ id });
    if (!subscription) {
      return BaseResponse.error('Subscription not found', HttpStatus.NOT_FOUND);
    }
    await this.subscriptionRepository.findOneAndUpdate(
      { id },
      <SubscriptionEntity>data,
    );
    return BaseResponse.success(
      null,
      'Subscription updated successfully',
      HttpStatus.OK,
    );
  }

  async createUserSubscription(user: UserEntity, data: SubscribeUserDto) {
    const subscription = await this.subscriptionRepository.findOne({
      id: data.subscriptionId,
    });
    if (!subscription) {
      return BaseResponse.error(
        'Subscription not found',
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    //check of active subscription
    const activeSubscription = await this.subscribeUserRepository.findOne({
      user_id: user.id,
      status: SubscriptionStatus.ACTIVE,
    });
    if (activeSubscription) {
      return BaseResponse.error(
        'User already has an active subscription',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    const date = calculateSubscriptionEndDate(new Date(), 1);
    const dataInsert = {
      user_id: user.id,
      subscription_details: subscription,
      status: SubscriptionStatus.PENDING,
      expired_at: date,
    };
    await this.subscribeUserRepository.save(<SubscribeUserEntity>dataInsert);
    const payStackResponse = await this.payStackService.initializeTransaction(
      user.email,
      subscription.subscription_price * 100,
      'https://your-callback-url.com',
      {
        userId: user.id,
        paymentType: PaymentType.SUBSCRIPTION,
        cancel_action: 'https://your-cancel-url.com',
      },
    );
    const authorizationUrl = payStackResponse.data.authorization_url;
    return BaseResponse.success(
      { url: authorizationUrl },
      'User subscribed successfully',
      HttpStatus.CREATED,
    );
  }

  async getUserSubscription(userId: string, data: PaginationDto) {
    const pageSize = parseInt(data.page, 10);
    const limitInt = parseInt(data.limit, 10);
    const whereClause: any = { userId };
    if (data.start_date) {
      const startDate = new Date(data.start_date); // Parse the date string
      if (!isNaN(startDate.getTime())) {
        // Ensure valid date parsing
        whereClause.createdAt = MoreThanOrEqual(startDate);
      }
    }
    const subscriptions = await this.subscribeUserRepository.findPaginated(
      limitInt,
      pageSize,
      whereClause,
      { created_at: 'DESC' },
    );
    return BaseResponse.success(
      subscriptions,
      'Subscription fetched successfully',
    );
  }

  async getAllUserSubscription(data: PaginationDto) {
    const pageSize = parseInt(data.page, 10);
    const limitInt = parseInt(data.limit, 10);
    const subscriptions = await this.subscribeUserRepository.findPaginated(
      limitInt,
      pageSize,
      {},
      { created_at: 'DESC' },
    );
    return BaseResponse.success(
      subscriptions,
      'Subscription fetched successfully',
    );
  }

  async makeSubscriptionPayment(subscriptionId: string) {
    const subscription = await this.subscribeUserRepository.findOne({
      id: subscriptionId,
    });
    if (!subscription) {
      return BaseResponse.error(
        'Subscription not found',
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.subscribeUserRepository.findOneAndUpdate(
      { id: subscriptionId },
      { status: SubscriptionStatus.ACTIVE },
    );
    return BaseResponse.success(
      null,
      'Subscription payment made successfully',
      HttpStatus.OK,
    );
  }

  //TODO  chat limit
}
