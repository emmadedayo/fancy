import { Injectable } from '@nestjs/common';
import { PostRepository } from './repos/post-repository';
import { PostImageRepository } from './repos/post-image-repository';
import { PostViewRepository } from './repos/post-view-repository';
import { PostLikeRepository } from './repos/post-like-repository';
import { PostCommentRepository } from './repos/post-comment-repository';
import { PostUserTagRepository } from './repos/post-tags-repository';
import { CommentDto, PostDto, PostViewDto } from './dtos/post.dto';
import { PostImageEntity } from './entity/post-image-entity';
import { PostUserTagEntity } from './entity/post-tags-entity';
import { BaseResponse } from '../../libs/response/base_response';
import { PostBooMarkRepository } from './repos/post-bookmark-repository';
import { PaginationDto } from '../../libs/pagination/pagination';
import { UserFollowerRepository } from '../user/repositories/user_follower_repository';
import { In, Not } from 'typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Config } from '../../config';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postImageRepository: PostImageRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postCommentRepository: PostCommentRepository,
    private readonly postTagRepository: PostUserTagRepository,
    private readonly postViewRepository: PostViewRepository,
    private readonly postBooMarkRepository: PostBooMarkRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    @InjectQueue(Config.SEND_POST_NOTIFICATION)
    private readonly postNotificationQueue: Queue,
    @InjectQueue(Config.SEND_LIKE_NOTIFICATION)
    private readonly postNotificationLikeQueue: Queue,
    @InjectQueue(Config.SEND_LIKE_NOTIFICATION)
    private readonly postNotificationCommentQueue: Queue,
  ) {}

  async createPost(user: UserEntity, postDto: PostDto) {
    // Create a new post
    const { images, hashtags, ...postFields } = postDto;
    postDto['userId'] = user.id;
    const post = await this.postRepository.save({
      ...postFields,
      userId: user.id,
    });

    if (images && images.length > 0) {
      const imageEntities = images.map((image) => {
        const postImage = new PostImageEntity();
        postImage.postId = post.id;
        postImage.image = image;
        return postImage;
      });
      await this.postImageRepository.saveMany(imageEntities);
    }

    // Save hashtags
    if (hashtags && hashtags.length > 0) {
      const tagEntities = hashtags.map((tag) => {
        const postTag = new PostUserTagEntity();
        postTag.postId = post.id;
        postTag.userId = tag;
        return postTag;
      });
      await this.postTagRepository.saveMany(tagEntities);
    }
    await this.postNotificationQueue.add({ post, user });
    return BaseResponse.success(null, 'Post created successfully');
  }

  async updatePost(userId: string, postId: string, postDto: PostDto) {
    // Update a post
    const post = await this.postRepository.findOne({ id: postId, userId });
    if (!post) {
      return BaseResponse.error('Post not found', 404);
    }

    const { images, hashtags, ...postFields } = postDto;
    await this.postRepository.update({ id: postId }, postFields);

    if (images && images.length > 0) {
      await this.postImageRepository.findOneAndDelete({ postId });
      const imageEntities = images.map((image) => {
        const postImage = new PostImageEntity();
        postImage.postId = post.id;
        postImage.image = image;
        return postImage;
      });
      await this.postImageRepository.saveMany(imageEntities);
    }

    // Save hashtags
    if (hashtags && hashtags.length > 0) {
      await this.postTagRepository.findOneAndDelete({ postId });
      const tagEntities = hashtags.map((tag) => {
        const postTag = new PostUserTagEntity();
        postTag.postId = post.id;
        postTag.userId = tag;
        return postTag;
      });
      await this.postTagRepository.saveMany(tagEntities);
    }
    return BaseResponse.success(null, 'Post updated successfully');
  }

  async deleteImage(imageId: string) {
    // Delete a post image
    await this.postImageRepository.findOneAndDelete({ id: imageId });
    return BaseResponse.success(null, 'Image deleted successfully');
  }

  async deleteTag(tagId: string) {
    // Delete a post tag
    await this.postTagRepository.findOneAndDelete({ id: tagId });
    return BaseResponse.success(null, 'Tag deleted successfully');
  }

  async deletePost(postId: string) {
    // Delete a post
    await this.postRepository.update({ id: postId }, { deletedAt: new Date() });
    return BaseResponse.success(null, 'Post deleted successfully');
  }

  async likePost(userId: string, postId: string) {
    // Like a post
    const postLike = await this.postLikeRepository.findOne({ id: postId });
    if (postLike) {
      //delete like
      await this.postLikeRepository.findOneAndDelete({ id: postId });
    }
    const res = await this.postLikeRepository.save({ postId, userId });
    await this.postNotificationLikeQueue.add({ res, userId });
    return BaseResponse.success(null, 'Post liked successfully');
  }

  async commentPost(userId: string, postId: string, data: CommentDto) {
    // Comment on a post
    const comment = await this.postCommentRepository.save({
      userId,
      postId,
      comment: data.comment,
    });
    await this.postNotificationCommentQueue.add({ comment, userId });
    return BaseResponse.success(null, 'Post commented successfully');
  }

  async deleteComment(commentId: string) {
    // Delete a comment
    await this.postCommentRepository.findOneAndDelete({ id: commentId });
    return BaseResponse.success(null, 'Comment deleted successfully');
  }

  async viewPostOrShare(
    userId: string,
    postId: string,
    postViewDto: PostViewDto,
  ) {
    //check if user has viewed post or shared post
    const postView = await this.postViewRepository.findOne({
      userId,
      postId,
    });
    if (postView) {
      return BaseResponse.error('Post already viewed', 400);
    }
    // View a post
    await this.postViewRepository.save({
      userId,
      postId,
      type: postViewDto.type,
    });
    return BaseResponse.success(null, 'Post viewed successfully');
  }

  async bookmarkPost(userId: string, postId: string) {
    // Bookmark a post
    const postBookmark = await this.postBooMarkRepository.findOne({
      postId: postId,
      userId: userId,
    });
    if (postBookmark) {
      //delete bookmark
      await this.postBooMarkRepository.findOneAndDelete({ postId: postId });
    }

    await this.postBooMarkRepository.save({ postId: postId, userId: userId });
    return BaseResponse.success(null, 'Post bookmarked successfully');
  }

  async getBookmarkedPosts(userId: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const where = { userId };
    const posts = await this.postBooMarkRepository.findPostPagination(
      pageSize,
      currentPage,
      where,
      {},
      { post: { images: true } },
    );
    return BaseResponse.success(posts, 'Bookmarked posts fetched successfully');
  }

  async deleteBookmark(bookmarkId: string) {
    // Delete a bookmark
    await this.postBooMarkRepository.findOneAndDelete({ id: bookmarkId });
    return BaseResponse.success(null, 'Bookmark deleted successfully');
  }

  async getPosts(userId: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    let posts;

    const friends = await this.userFollowerRepository.find([
      { followerId: userId, isAccepted: true },
      { followingId: userId, isAccepted: true },
    ]);
    const friendIds = friends.map((friend) =>
      friend.followerId === userId ? friend.followingId : friend.followerId,
    );

    const MIN_FRIEND_POSTS = 3; // Adjust this threshold as needed
    const friendPostCount = await this.postRepository.countWhereIn(
      {},
      'userId',
      friendIds,
    );

    if (friendPostCount >= MIN_FRIEND_POSTS) {
      // Enough friend posts, fetch only those
      posts = await this.postRepository.findPost(
        pageSize,
        currentPage,
        { userId: In(friendIds) },
        {},
        { images: true }, // Eager load
      );
    } else {
      // Not enough friend posts, fetch all posts
      const friendPostIds = (
        await this.postRepository.find([{ userId: In(friendIds) }])
      ).map((post) => post.id);
      const topPosts = await this.postRepository.findPost(
        pageSize,
        currentPage,
        [{ id: Not(In(friendPostIds)) }],
        {},
        {},
        true,
      );
      posts = topPosts;
      //console.log('lenght' + posts);
    }
    return BaseResponse.success(posts, 'Posts fetched successfully');
  }

  async getComment(postId: string, data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    const comments = await this.postCommentRepository.findPaginated(
      pageSize,
      currentPage,
      { postId },
      {},
      { user: true },
    );
    return BaseResponse.success(comments, 'Comments fetched successfully');
  }
}
