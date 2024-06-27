import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscribeUserRepository } from '../repo/subscribe-user-repo';
import { SubscriptionStatus } from '../entities/user_subscription.entity';

@Injectable()
export class ScheduleTaskService {
  private readonly logger = new Logger(ScheduleTaskService.name);
  constructor(
    private readonly subscribeUserRepository: SubscribeUserRepository,
  ) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    //get all from subscribeUserRepository
    this.logger.debug('Called when the current second is 5');
    const subscribeUsers = await this.subscribeUserRepository.find([
      { status: SubscriptionStatus.ACTIVE },
    ]);
    //loop through all subscribeUsers
    for (const subscribeUser of subscribeUsers) {
      if (subscribeUser.expired_at < new Date()) {
        subscribeUser.status = SubscriptionStatus.INACTIVE;
        await this.subscribeUserRepository.save(subscribeUser);
      }
    }
  }
}
