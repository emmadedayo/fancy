import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostPaidViewEntity } from '../entity/post-paid.entity';

@Injectable()
export class PostPaidRepository extends AbstractRepo<PostPaidViewEntity> {
  constructor() {
    super(PostPaidViewEntity);
  }
}
