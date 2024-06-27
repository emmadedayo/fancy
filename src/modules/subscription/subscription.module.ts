import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscribeUserRepository } from './repo/subscribe-user-repo';
import { SubscriptionRepository } from './repo/subscription-repo';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { ScheduleTaskService } from "./task/schedule_task";

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    SubscribeUserRepository,
    SubscriptionRepository,
    PayStackService,
    ScheduleTaskService,
  ],
})
export class SubscriptionModule {}
