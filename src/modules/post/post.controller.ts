import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CommentDto, PostDto, PostViewDto } from './dtos/post.dto';
import { CurrentUser } from '../user/decorator/user.decorator';
import { PaginationDto } from '../../libs/pagination/pagination';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  createPost(@CurrentUser() user: any, @Body() data: PostDto) {
    return this.postService.createPost(user, data);
  }

  @Put('update/:id')
  updatePost(
    @CurrentUser() userId: any,
    @Param('id') postId: string,
    @Body() postDto: PostDto,
  ) {
    return this.postService.updatePost(userId.id, postId, postDto);
  }

  @Delete('delete/:id')
  deletePost(@CurrentUser() userId: any, @Param('id') postId: string) {
    return this.postService.deletePost(postId);
  }

  @Put('like/:id')
  likePost(@CurrentUser() userId: any, @Param('id') postId: string) {
    return this.postService.likePost(userId, postId);
  }

  @Put('comment/:id')
  commentPost(
    @CurrentUser() userId: any,
    @Param('id') postId: string,
    @Body() data: CommentDto,
  ) {
    return this.postService.commentPost(userId, postId, data);
  }

  @Delete('comment/:id')
  deleteComment(@CurrentUser() userId: any, @Param('id') commentId: string) {
    return this.postService.deleteComment(commentId);
  }

  @Put('view-or-share/:id')
  viewPostOrShare(
    @CurrentUser() userId: any,
    @Param('id') postId: string,
    @Body() postViewDto: PostViewDto,
  ) {
    return this.postService.viewPostOrShare(userId, postId, postViewDto);
  }

  @Put('bookmark/:id')
  bookmarkPost(@CurrentUser() userId: any, @Param('id') postId: string) {
    return this.postService.bookmarkPost(userId.id, postId);
  }

  @Get('bookmarks')
  getBookmarkedPosts(@CurrentUser() userId: any, @Query() data: PaginationDto) {
    return this.postService.getBookmarkedPosts(userId.id, data);
  }

  @Delete('delete-image/:id')
  deleteImage(@CurrentUser() userId: any, @Param('id') imageId: string) {
    return this.postService.deleteImage(imageId);
  }

  @Delete('delete-tag/:id')
  deleteTag(@CurrentUser() userId: any, @Param('id') tagId: string) {
    return this.postService.deleteTag(tagId);
  }

  @Delete('delete-bookmark/:id')
  deleteBookmark(@CurrentUser() userId: any, @Param('id') bookmarkId: string) {
    return this.postService.deleteBookmark(bookmarkId);
  }

  @Get('get-post')
  getPosts(@CurrentUser() userId: any, @Query() data: PaginationDto) {
    return this.postService.getPosts(userId.id, data);
  }

  @Get('get-post-comment')
  getComments(
    @CurrentUser() userId: any,
    @Query('id') postId: string,
    @Query() data: PaginationDto,
  ) {
    return this.postService.getComment(postId, data);
  }

  @Put('pay/:id')
  payForPost(
    @CurrentUser() userId: any,
    @Param('id') postId: string,
  ) {
    return this.postService.payForPost(userId, postId);
  }
}
