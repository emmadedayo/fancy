import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostUserTagEntity } from '../entity/post-tags-entity';

@Injectable()
export class PostUserTagRepository extends AbstractRepo<PostUserTagEntity> {
  constructor() {
    super(PostUserTagEntity);
  }
}
