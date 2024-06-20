import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostViewEntity } from '../entity/post-view-entity';

@Injectable()
export class PostViewRepository extends AbstractRepo<PostViewEntity> {
  constructor() {
    super(PostViewEntity);
  }
}
