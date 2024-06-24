import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class UniqueValidationPipe implements PipeTransform {
  constructor(private readonly userRepository: UserRepository) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value; // No need for BaseResponse if validation is not needed
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    // Custom uniqueness checks with custom error messages
    if (value.email && (await this.userRepository.findByEmail(value.email))) {
      throw new BadRequestException('Email already exists');
    }
    if (
      value.username &&
      (await this.userRepository.findByUsername(value.username))
    ) {
      throw new BadRequestException('Username already exists');
    }
    if (value.phone && (await this.userRepository.findByPhone(value.phone))) {
      throw new BadRequestException('Phone number already exists');
    }

    if (errors.length > 0) {
      // Throw a BadRequestException for other validation errors
      throw new BadRequestException(errors);
    }

    return value;
  }

  private toValidate(metaType: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}
