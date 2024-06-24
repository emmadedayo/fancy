import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { PostCommentEntity } from '../entity/post-comment-entity';

@Injectable()
export class PostCommentRepository extends AbstractRepo<PostCommentEntity> {
  constructor() {
    super(PostCommentEntity);
  }
}
