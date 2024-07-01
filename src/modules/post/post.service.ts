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
      user_id: user.id,
    });

    if (images && images.length > 0) {
      const imageEntities = images.map((image) => {
        const postImage = new PostImageEntity();
        postImage.post_id = post.id;
        postImage.image = image;
        return postImage;
      });
      await this.postImageRepository.saveMany(imageEntities);
    }

    // Save hashtags
    if (hashtags && hashtags.length > 0) {
      const tagEntities = hashtags.map((tag) => {
        const postTag = new PostUserTagEntity();
        postTag.post_id = post.id;
        postTag.user_id = tag;
        return postTag;
      });
      await this.postTagRepository.saveMany(tagEntities);
    }
    await this.postNotificationQueue.add({ post, user });
    return BaseResponse.success(null, 'Post created successfully');
  }

  async updatePost(user_id: string, post_id: string, postDto: PostDto) {
    // Update a post
    const post = await this.postRepository.findOne({ id: post_id, user_id });
    if (!post) {
      return BaseResponse.error('Post not found', 404);
    }

    const { images, hashtags, ...postFields } = postDto;
    await this.postRepository.update({ id: post_id }, postFields);

    if (images && images.length > 0) {
      await this.postImageRepository.findOneAndDelete({ post_id });
      const imageEntities = images.map((image) => {
        const postImage = new PostImageEntity();
        postImage.post_id = post.id;
        postImage.image = image;
        return postImage;
      });
      await this.postImageRepository.saveMany(imageEntities);
    }

    // Save hashtags
    if (hashtags && hashtags.length > 0) {
      await this.postTagRepository.findOneAndDelete({ post_id });
      const tagEntities = hashtags.map((tag) => {
        const postTag = new PostUserTagEntity();
        postTag.post_id = post.id;
        postTag.user_id = tag;
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
    await this.postRepository.update(
      { id: postId },
      { deleted_at: new Date() },
    );
    return BaseResponse.success(null, 'Post deleted successfully');
  }

  async likePost(user_id: string, post_id: string) {
    // Like a post
    const postLike = await this.postLikeRepository.findOne({ id: post_id });
    if (postLike) {
      //delete like
      await this.postLikeRepository.findOneAndDelete({ id: post_id });
    }
    const res = await this.postLikeRepository.save({ post_id, user_id });
    await this.postNotificationLikeQueue.add({ res, user_id });
    return BaseResponse.success(null, 'Post liked successfully');
  }

  async commentPost(user_id: string, post_id: string, data: CommentDto) {
    // Comment on a post
    const comment = await this.postCommentRepository.save({
      user_id,
      post_id,
      comment: data.comment,
    });
    await this.postNotificationCommentQueue.add({ comment, user_id });
    return BaseResponse.success(null, 'Post commented successfully');
  }

  async deleteComment(commentId: string) {
    // Delete a comment
    await this.postCommentRepository.findOneAndDelete({ id: commentId });
    return BaseResponse.success(null, 'Comment deleted successfully');
  }

  async viewPostOrShare(
    user_id: UserEntity,
    post_id: string,
    postViewDto: PostViewDto,
  ) {
    //check if user has viewed post or shared post
    const postView = await this.postViewRepository.find([
      {
        user_id: user_id.id,
      },
      {
        post_id: post_id,
      },
      {
        type: postViewDto.type,
      },
    ]);
    if (postView.length !== 0) {
      //delete view
      await this.postViewRepository.findOneAndDelete({ id: postView[0].id });
      return BaseResponse.success(null, 'Post unviewed successfully');
    }
    // View a post
    await this.postViewRepository.save({
      user_id: user_id.id,
      post_id,
      type: postViewDto.type,
    });
    return BaseResponse.success(null, 'Post viewed successfully');
  }

  async bookmarkPost(userId: string, postId: string) {
    // Bookmark a post
    const postBookmark = await this.postBooMarkRepository.findOne({
      post_id: postId,
      user_id: userId,
    });
    if (postBookmark) {
      //delete bookmark
      await this.postBooMarkRepository.findOneAndDelete({ post_id: postId });
    }

    await this.postBooMarkRepository.save({ post_id: postId, user_id: userId });
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
      'user_id',
      friendIds,
    );

    if (friendPostCount >= MIN_FRIEND_POSTS) {
      // Enough friend posts, fetch only those
      posts = await this.postRepository.findPost(
        pageSize,
        currentPage,
        { userId: In(friendIds) },
        {},
        { images: true, user: true }, // Eager load
      );
      //find password from user and remove it
      posts.data.forEach((post) => {
        delete post.user.password;
      });
    } else {
      // Not enough friend posts, fetch all posts
      const friendPostIds = (
        await this.postRepository.find([{ user_id: In(friendIds) }])
      ).map((post) => post.id);
      const topPosts = await this.postRepository.findPost(
        pageSize,
        currentPage,
        [{ id: Not(In(friendPostIds)) }],
        {},
        {},
        true,
      );
      //find password from user and remove it
      topPosts.data.forEach((post) => {
        delete post.user.password;
      });
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
