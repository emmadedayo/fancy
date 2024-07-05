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
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { CurrentUser } from '../user/decorator/user.decorator';
import { PaginationDto } from '../../libs/pagination/pagination';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Get('get-all-subscription')
  getAllUserSubscription(@Query() pagination: PaginationDto) {
    return this.subscriptionService.getAllUserSubscription(pagination);
  }

  @Put('update-subscription-payment/:id')
  updateSubscriptionPayment(@Param('id') id: string) {
    return this.subscriptionService.makeSubscriptionPayment(id);
  }

  @Get('get-all')
  getAll() {
    return this.subscriptionService.getAllSubscription();
  }

  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptionById(id);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.subscriptionService.deleteSubscription(id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.updateSubscription(
      id,
      createSubscriptionDto,
    );
  }

  // @Post('create-user-subscription')
  // createUserSubscription(
  //   @Body() subscribeUserDto: SubscribeUserDto,
  //   @CurrentUser() user,
  // ) {
  //   return this.subscriptionService.createUserSubscription(
  //     user,
  //     subscribeUserDto,
  //   );
  // }

  @Get('get-my-subscription')
  getMySubscription(@CurrentUser() user, @Query() pagination: PaginationDto) {
    return this.subscriptionService.getUserSubscription(user.id, pagination);
  }
}
