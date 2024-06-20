import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostImageEntity } from '../entity/post-image-entity';

@Injectable()
export class PostImageRepository extends AbstractRepo<PostImageEntity> {
  constructor() {
    super(PostImageEntity);
  }
}
