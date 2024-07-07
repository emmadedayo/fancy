import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateLoginDto,
  CreateUserDto,
  ResetAccountDto,
  VerifyCodeDto,
} from './dto/authentication.dto';
import { UserEntity } from '../user/entity/user.entity';
import {
  generateCode,
  generateUniqueIdFromName,
} from '../../libs/common/helpers/utils';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Config } from '../../config';
import { BaseResponse } from '../../libs/response/base_response';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserWalletRepository } from '../user/repositories/user_wallet.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userWalletRepository: UserWalletRepository,
    @InjectRedis() private readonly cacheManager: Redis,
    @InjectQueue(Config.CREATE_USER_QUEUE)
    private readonly registrationQueue: Queue,
    @InjectQueue(Config.UPDATE_USER_CONSUMER)
    private readonly updateUserConsumer: Queue,
    private jwtService: JwtService,
  ) {}

  /**
   *  create user
   */
  async createUser(data: CreateUserDto) {
    //bcryptjs data.password
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    //add user_id to data
    data['user_id'] = generateUniqueIdFromName(data.name);
    const user = await this.userRepository.save(<UserEntity>data);
    if (!user) {
      throw new Error('User not created');
    }
    const code = generateCode();
    await this.cacheManager.set(data.email, code);
    await this.registrationQueue.add({
      code,
      user: user,
      type: Config.VERIFICATION_TYPE,
    });
    //return response
    return BaseResponse.success(
      null,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  /**
   *  email verification
   */

  async verifyWithEmail(data: VerifyCodeDto) {
    const userId = await this.cacheManager.get(data.email);
    if (!userId) {
      return BaseResponse.error('Invalid code', null, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    if (data.type === 'REGISTER') {
      user.email_verified_at = new Date();
      user.is_email_verified = true;
      user.account_status = 'ACTIVE';
      await this.userRepository.findOneAndUpdate({ id: user.id }, user);
      await this.userWalletRepository.addUserWallet(user);
      await this.updateUserConsumer.add({
        user: user,
      });
    }
    return BaseResponse.success(
      null,
      'Email verified successfully',
      HttpStatus.OK,
    );
  }

  /**
   * phone verification
   */
  async verifyWithPhone(data: VerifyCodeDto) {
    const userId = await this.cacheManager.get(data.code);
    if (!userId) {
      return BaseResponse.error('Invalid code', null, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ phone: data.email });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    user.phone_verified_at = new Date();
    user.is_phone_verified = true;
    user.account_status = 'ACTIVE';
    await this.userRepository.findOneAndUpdate({ id: user.id }, user);
    await this.updateUserConsumer.add({
      user: user,
    });
    return BaseResponse.success(
      { user },
      'Phone verified successfully',
      HttpStatus.OK,
    );
  }

  /**
   *  resend verification code
   */

  async resendVerificationCode(data: ResetAccountDto) {
    const user = await this.userRepository.findOne({
      email: data.generic_data,
    });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const code = generateCode();
    await this.cacheManager.set(user.email, code);
    await this.registrationQueue.add({
      code,
      user: user,
      type: Config.VERIFICATION_TYPE,
    });
    return BaseResponse.success(
      null,
      'Verification code sent successfully',
      HttpStatus.OK,
    );
  }

  /**
   *  reset account
   */

  async resetAccount(data: ResetAccountDto) {
    //data.generic can be email or phone or username
    const user = await this.userRepository.findOne({
      email: data.generic_data,
    });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const code = generateCode();
    await this.cacheManager.set(user.email, code);
    await this.registrationQueue.add(Config.RESET_PASSWORD_QUEUE, {
      code,
      user: user,
      type: Config.RESET_PASSWORD_QUEUE,
    });
    return BaseResponse.success(
      null,
      'Reset code sent successfully',
      HttpStatus.OK,
    );
  }

  /**
   * change password
   */
  async changePassword(data: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(data.password, salt);
    await this.userRepository.findOneAndUpdate({ id: user.id }, user);
    return BaseResponse.success(
      null,
      'Password changed successfully',
      HttpStatus.OK,
    );
  }

  /**
   * login
   */

  async login(data: CreateLoginDto) {
    const user = await this.userRepository.findOne({ email: data.email });
    if (!user) {
      return BaseResponse.error('User not found', null, HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return BaseResponse.error(
        'Invalid credentials',
        null,
        HttpStatus.BAD_REQUEST,
      );
    }
    const accessToken = this.jwtService.sign({ sub: user }, { expiresIn: null });
    return BaseResponse.success(
      { user, accessToken },
      'Login successful',
      HttpStatus.OK,
    );
  }
}
