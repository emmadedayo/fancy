import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends AbstractRepo<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async addUser(data: UserEntity) {
    return this.save(data);
  }
  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.findOne({ username });
  }

  async findByPhone(phone: string) {
    return this.findOne({ phone });
  }
}
