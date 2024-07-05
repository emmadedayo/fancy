import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserTransactionEntity } from '../entity/user_transaction.entity';

@Injectable()
export class UserTransactionRepository extends AbstractRepo<UserTransactionEntity> {
  constructor() {
    super(UserTransactionEntity);
  }
}
