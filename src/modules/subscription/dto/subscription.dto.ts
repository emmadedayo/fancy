import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

interface SubscriptionFeatures {
  call_limit: number;
  video_limit: number;
  chat_limit: number;
}

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  subscriptionName: string;

  @IsNotEmpty()
  @IsString()
  subscriptionDescription: string;

  @IsNotEmpty()
  @IsNumber()
  subscriptionPrice: number;

  @IsNotEmpty()
  @IsObject()
  subscriptionFeatures: SubscriptionFeatures;
}

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  subscriptionName?: string;

  @IsOptional()
  @IsString()
  subscriptionDescription?: string;

  @IsOptional()
  @IsNumber()
  subscriptionPrice?: number;

  @IsNotEmpty()
  @IsObject()
  subscriptionFeatures: SubscriptionFeatures;
}

export class SubscribeUserDto {
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;
}
