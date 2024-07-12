import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserSubscriptionSettingEntity } from '../entity/user_subscription_settings.entity';

@Injectable()
export class UserSubscriptionSettingsRepository extends AbstractRepo<UserSubscriptionSettingEntity> {
  constructor() {
    super(UserSubscriptionSettingEntity);
  }
}
