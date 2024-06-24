import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { FundRaisingStatus } from '../entity/fundraise.entity';

// DTO for creating a new fundraising
export class CreateFundRaisingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional() // Assuming images are optional during creation
  @IsString()
  images?: string;

  @IsNotEmpty()
  @IsNumber()
  targetAmount: number;
}

// DTO for updating an existing fundraising
export class UpdateFundRaisingDto {
  @IsOptional()
  @IsUUID()
  userId?: string; // Optional for updates

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  images?: string;

  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @IsOptional()
  @IsEnum(FundRaisingStatus)
  status?: FundRaisingStatus;

  @IsOptional()
  @IsString()
  slugUrl?: string;
}

export class MakeDonationDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  fundRaisingId: string;
}