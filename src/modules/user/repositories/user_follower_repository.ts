import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserFriendEntity } from '../entity/user_follower.entity';

@Injectable()
export class UserFollowerRepository extends AbstractRepo<UserFriendEntity> {
  constructor() {
    super(UserFriendEntity);
  }
}
