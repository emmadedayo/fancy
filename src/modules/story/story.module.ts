import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { StoryRepository } from './repo/story.repo';
import { StoryCommentRepository } from './repo/story_comment.repo';
import { StoryViewRepository } from './repo/story-view.repo';

@Module({
  controllers: [StoryController],
  providers: [
    StoryService,
    StoryRepository,
    StoryCommentRepository,
    StoryViewRepository,
  ],
})
export class StoryModule {}
