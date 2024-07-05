import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserSubscriptionSettings } from '../entity/user_subscription_settings.entity';

@Injectable()
export class UserSubscriptionSettingsRepository extends AbstractRepo<UserSubscriptionSettings> {
  constructor() {
    super(UserSubscriptionSettings);
  }
}
