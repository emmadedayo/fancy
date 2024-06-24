import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostLikeEntity } from '../entity/post-like-entity';

@Injectable()
export class PostLikeRepository extends AbstractRepo<PostLikeEntity> {
  constructor() {
    super(PostLikeEntity);
  }
}
