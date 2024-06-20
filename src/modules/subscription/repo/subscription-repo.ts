import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends AbstractRepo<SubscriptionEntity> {
  constructor() {
    super(SubscriptionEntity);
  }
}
