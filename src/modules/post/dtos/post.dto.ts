import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PostViewType } from '../entity/post-view-entity';

export class PostDto {
  @IsString()
  caption: string;

  @IsArray()
  hashtags: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @IsString()
  @IsOptional()
  tips_amount: string;

  @IsBoolean()
  isFree: boolean;
}

export class CommentDto {
  @IsString()
  comment: string;
}

export class PostViewDto {
  @IsEnum(PostViewType) // Validate that type is a valid PostViewType
  type: PostViewType;
}
