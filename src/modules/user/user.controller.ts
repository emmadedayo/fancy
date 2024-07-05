import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorator/user.decorator';
import { PaginationDto } from '../../libs/pagination/pagination';
import {
  BankDetailsDto,
  BankValidatorDto,
  FollowerRequestDto,
  SubscriptionSettings,
  UpdateUserDto,
} from './dto/user.dto';
import { UserAdminService } from './user-admin.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAdminService: UserAdminService,
  ) {}

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.userService.getMe(user.id);
  }

  @Get('followers')
  getFollowers(@CurrentUser() user: any, @Query() data: PaginationDto) {
    return this.userService.getFollowers(user.id, data);
  }

  @Post('update')
  updateUser(@CurrentUser() user: any, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(user.id, data);
  }

  @Delete('delete')
  deleteUser(@CurrentUser() user: any) {
    return this.userService.deleteUser(user.id);
  }

  @Post('request-creator')
  requestCreator(@CurrentUser() user: any) {
    return this.userService.requestCreator(user.id);
  }

  @Post('follow-request')
  followerRequest(@CurrentUser() user: any, @Body() data: FollowerRequestDto) {
    return this.userService.followerRequest(data, user.id);
  }

  @Put('accept-follow-request/:id')
  acceptFollowerRequest(@CurrentUser() user: any, @Param('id') id: string) {
    return this.userService.acceptFollowerRequest(id, user.id);
  }

  @Put('unfollow/:id')
  unfollowUser(@CurrentUser() user: any, @Param('id') id: string) {
    return this.userService.unfollowUser(id);
  }

  @Get('search')
  searchUser(@Query() data: PaginationDto) {
    return this.userService.searchUser(data);
  }

  @Get('get-bank')
  getBank() {
    return this.userService.getBank();
  }

  @Post('validate-bank')
  validateBank(@Body() data: BankValidatorDto) {
    return this.userService.validateBank(data);
  }

  @Get('all')
  getAllUsers(@Query() data: PaginationDto) {
    return this.userAdminService.getAllUsers(data);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userAdminService.getUser(id);
  }

  @Put('ban/:id')
  disableUser(@Param('id') id: string) {
    return this.userAdminService.disableUser(id);
  }

  @Put('unban/:id')
  enableUser(@Param('id') id: string) {
    return this.userAdminService.enableUser(id);
  }

  @Put('approve-creator/:id')
  approveCreator(@Param('id') id: string) {
    return this.userAdminService.approveCreator(id);
  }

  @Put('reject-creator/:id')
  rejectCreator(@Param('id') id: string) {
    return this.userAdminService.disableCreator(id);
  }

  @Put('update-bank/:id')
  updateBankDetails(@Param('id') id: string, @Body() data: BankDetailsDto) {
    return this.userService.updateBankDetails(id, data);
  }

  @Put('make-account-private/:id')
  makeAccountPrivate(@Param('id') id: string) {
    return this.userService.makeAccountPrivate(id);
  }

  @Put('is_available_for_call/:id')
  makeAvailableForCall(@Param('id') id: string) {
    return this.userService.isAccountAvailableForCall(id);
  }

  @Get('get-user-by-id/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('get-user-posts/:id')
  getUserPosts(@Param('id') id: string, @Query() data: PaginationDto) {
    return this.userService.getUserPosts(id, data);
  }

  @Post('update-subscription-settings')
  updateSubscriptionSettings(
    @CurrentUser() user: any,
    @Body() data: SubscriptionSettings,
  ) {
    return this.userService.updateSubscriptionSettings(user.id, data);
  }
}
