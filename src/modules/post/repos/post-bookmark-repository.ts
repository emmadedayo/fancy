import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostBookmarkEntity } from '../entity/post-bookmark-entity';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

@Injectable()
export class PostBooMarkRepository extends AbstractRepo<PostBookmarkEntity> {
  constructor() {
    super(PostBookmarkEntity);
  }
}
