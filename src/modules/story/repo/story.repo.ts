import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { StoryEntity } from '../entity/story.entity';

@Injectable()
export class StoryRepository extends AbstractRepo<StoryEntity> {
  constructor() {
    super(StoryEntity);
  }
}
