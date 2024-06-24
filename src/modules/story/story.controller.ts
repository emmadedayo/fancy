import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { StoryService } from './story.service';
import { CommentDto, StoryDto, StoryViewDto } from './dto/story.dto';
import { CurrentUser } from '../user/decorator/user.decorator';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post('create')
  async createStory(@Body() storyDto: StoryDto, @CurrentUser() user) {
    return this.storyService.createStory(storyDto, user.id);
  }

  @Delete('delete/:id')
  async deleteStory(@Param('id') story_id: string, @CurrentUser() user) {
    return this.storyService.deleteStory(story_id, user.id);
  }

  @Put('comment/:id')
  async commentOnStory(
    @Param('id') story_id: string,
    @Body() comment: CommentDto,
    @CurrentUser() user,
  ) {
    return this.storyService.commentOnStory(story_id, user.id, comment);
  }

  @Post('create-story-view')
  async createStoryView(
    @Body() storyViewDto: StoryViewDto,
    @CurrentUser() user,
  ) {
    return this.storyService.createStoryView(storyViewDto, user.id);
  }
}
