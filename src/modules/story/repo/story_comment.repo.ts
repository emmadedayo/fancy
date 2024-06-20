import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { StoryCommentEntity } from '../entity/story-comment.entity';

@Injectable()
export class StoryCommentRepository extends AbstractRepo<StoryCommentEntity> {
  constructor() {
    super(StoryCommentEntity);
  }
}
