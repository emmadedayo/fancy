import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { StoryViewEntity } from '../entity/story-view.entity';

@Injectable()
export class StoryViewRepository extends AbstractRepo<StoryViewEntity> {
  constructor() {
    super(StoryViewEntity);
  }
}
