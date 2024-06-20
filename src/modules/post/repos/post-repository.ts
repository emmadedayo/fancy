import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostEntity } from '../entity/post.entity';

@Injectable()
export class PostRepository extends AbstractRepo<PostEntity> {
  constructor() {
    super(PostEntity);
  }
}
