import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  ChangePasswordDto,
  CreateLoginDto,
  CreateUserDto,
  ResetAccountDto,
  VerifyCodeDto,
} from './dto/authentication.dto';
import { BaseResponse } from '../../libs/response/base_response';
import { UserEntity } from '../user/entity/user.entity';
import { UniqueValidationPipe } from './pipe/unique.pipe';
import { Public } from './strategy/public-strategy';

@Public()
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register-account')
  @UsePipes(UniqueValidationPipe)
  async registerAccount(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponse<any>> {
    return this.authenticationService.createUser(createUserDto);
  }

  @Post('verify-account-email')
  async verifyAccountEmail(
    @Body() verifyAccountEmail: VerifyCodeDto,
  ): Promise<BaseResponse<HttpStatus> | BaseResponse<{ user: UserEntity }>> {
    return this.authenticationService.verifyWithEmail(verifyAccountEmail);
  }

  @Post('verify-account-phone')
  async verifyAccountPhone(
    @Body() verifyAccountPhone: VerifyCodeDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authenticationService.verifyWithPhone(verifyAccountPhone);
  }

  @Post('reset-account')
  async resetAccount(
    @Body() resetAccount: ResetAccountDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authenticationService.resetAccount(resetAccount);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authenticationService.changePassword(changePassword);
  }

  @Post('login')
  async login(
    @Body() createLoginDto: CreateLoginDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authenticationService.login(createLoginDto);
  }

  //resendVerificationCode
  @Post('resend-verification-code')
  async resendVerificationCode(
    @Body() data: ResetAccountDto,
  ): Promise<BaseResponse<UserEntity | null>> {
    return this.authenticationService.resendVerificationCode(data);
  }
}
