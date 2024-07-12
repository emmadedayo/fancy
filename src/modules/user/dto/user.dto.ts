import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import Gender from '../../../libs/enum/gender.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  social?: string;
}

export class FollowerRequestDto {
  @IsString()
  user_id: string;
}

export class BankDetailsDto {
  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsString()
  @IsNotEmpty()
  bank_code: string;
}

export class BankValidatorDto {
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  bank_code: string;
}

export class SubscriptionSettings {
  @IsNumberString()
  @IsNotEmpty()
  bts_price: number;

  @IsNumberString()
  @IsNotEmpty()
  call_per_minute_price: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
