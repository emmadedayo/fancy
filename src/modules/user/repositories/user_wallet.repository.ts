import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserWallet } from '../entity/user_wallet.entity';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserWalletRepository extends AbstractRepo<UserWallet> {
  constructor() {
    super(UserWallet);
  }

  async addUserWallet(user: UserEntity) {
    const userWallet = new UserWallet();
    userWallet.user_id = user.id;
    return this.save(userWallet);
  }
}
