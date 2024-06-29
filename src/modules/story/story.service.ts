import { HttpStatus, Injectable } from '@nestjs/common';
import { StoryRepository } from './repo/story.repo';
import { StoryCommentRepository } from './repo/story_comment.repo';
import { CommentDto, StoryDto, StoryViewDto } from './dto/story.dto';
import { BaseResponse } from '../../libs/response/base_response';
import { StoryViewRepository } from './repo/story-view.repo';
import { StoryEntity } from './entity/story.entity';
import { StoryCommentEntity } from './entity/story-comment.entity';
import { StoryViewEntity } from './entity/story-view.entity';
import { PaginationDto } from '../../libs/pagination/pagination';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly storyCommentRepository: StoryCommentRepository,
    private readonly storyViewRepository: StoryViewRepository,
  ) {}

  async createStory(data: StoryDto, user_id: string) {
    data['user_id'] = user_id;
    await this.storyRepository.save(<StoryEntity>data);
    return BaseResponse.success(
      null,
      'Story created successfully',
      HttpStatus.CREATED,
    );
  }

  async deleteStory(story_id: string, user_id: string) {
    const story = await this.storyRepository.findOne({ id: story_id });
    if (!story) {
      return BaseResponse.error('Story not found', HttpStatus.NOT_FOUND);
    }
    if (story.user_id !== user_id) {
      return BaseResponse.error(
        'You are not authorized to delete this story',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.storyRepository.findOneAndUpdate(
      { id: story_id },
      { deletedAt: new Date() },
    );
    return BaseResponse.success(
      null,
      'Story deleted successfully',
      HttpStatus.OK,
    );
  }

  async commentOnStory(story_id: string, user_id: string, comment: CommentDto) {
    const story = await this.storyRepository.findOne({ id: story_id });
    if (!story) {
      return BaseResponse.error('Story not found', HttpStatus.NOT_FOUND);
    }
    const data = {
      story_id,
      user_id,
      comment: comment.comment,
    };
    await this.storyCommentRepository.save(<StoryCommentEntity>data);
    return BaseResponse.success(
      null,
      'Comment added successfully',
      HttpStatus.CREATED,
    );
  }

  async createStoryView(data: StoryViewDto, user_id: string) {
    const story = await this.storyRepository.findOne({ id: data.story_id });
    if (!story) {
      return BaseResponse.error('Story not found', HttpStatus.NOT_FOUND);
    }
    data['user_id'] = user_id;
    const checkView = await this.storyViewRepository.findOne({
      story_id: data.story_id,
      user_id,
    });
    if (checkView) {
      return null;
    } else {
      await this.storyViewRepository.save(<StoryViewEntity>data);
    }
    return BaseResponse.success(
      null,
      'Story view added successfully',
      HttpStatus.CREATED,
    );
  }

  async getStories(user_id: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const stories = await this.storyRepository.findPaginated(
      pageSize,
      currentPage,
      {},
      {}, // Optional: Provide ordering criteria if needed
      {},
    );
    return BaseResponse.success(
      stories,
      'Story view added successfully',
      HttpStatus.CREATED,
    );
  }
}
