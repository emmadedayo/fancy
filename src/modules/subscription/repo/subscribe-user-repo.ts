import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { SubscribeUserEntity } from '../entities/user_subscription.entity';

@Injectable()
export class SubscribeUserRepository extends AbstractRepo<SubscribeUserEntity> {
  constructor() {
    super(SubscribeUserEntity);
  }
}
