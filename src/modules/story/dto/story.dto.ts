import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class StoryDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsOptional()
  @IsString()
  hashtags?: string; // Optional, but if provided, must be a string

  @IsOptional()
  @IsString()
  file_type?: string; // Optional, but if provided, must be a string

  @IsOptional()
  @IsUrl()
  file_url?: string; // Optional, but if provided, must be a valid URL
}

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class StoryViewDto {
  @IsNotEmpty()
  @IsString()
  story_id: string;
}
