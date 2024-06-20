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
import { FundraisingService } from './fundraising.service';
import { CreateFundRaisingDto, MakeDonationDto } from './dto/fundraise.dto';
import { CurrentUser } from '../user/decorator/user.decorator';
import { PaginationDto } from '../../libs/pagination/pagination';

@Controller('fundraising')
export class FundraisingController {
  constructor(private readonly fundraisingService: FundraisingService) {}

  @Post('create')
  createFundraising(
    @CurrentUser() user,
    @Body() createFundraisingDto: CreateFundRaisingDto,
  ) {
    return this.fundraisingService.createFundRaiser(
      user.id,
      createFundraisingDto,
    );
  }

  @Get('get-my-fundraising')
  getMyFundraising(@CurrentUser() user, @Query() pagination: PaginationDto) {
    return this.fundraisingService.getMyFundRaiser(user.id, pagination);
  }

  @Put('update-fundraising/:id')
  updateFundRaiser(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() createFundraisingDto: CreateFundRaisingDto,
  ) {
    return this.fundraisingService.updateFundRaiser(
      user.id,
      createFundraisingDto,
      id,
    );
  }

  @Delete('delete-fundraising/:id')
  deleteFundRaiser(@Param('id') id: string, @CurrentUser() user) {
    return this.fundraisingService.deleteFundRaiser(id, user.id);
  }

  @Get('get-fundraising/:id')
  getMyFundRaiserById(@Param('id') id: string, @CurrentUser() user) {
    return this.fundraisingService.getFundRaiserById(id, user.id);
  }

  @Post('donate')
  donateToFundraising(
    @CurrentUser() user,
    @Body() makeDonationDto: MakeDonationDto,
  ) {
    return this.fundraisingService.makeDonation(user, makeDonationDto);
  }

  @Put('stop-fundraising/:id')
  stopFundraising(@Param('id') id: string, @CurrentUser() user) {
    return this.fundraisingService.stopFundraising(id, user.id);
  }

  @Get('get-all-fundraising')
  getAllFundRaise(@Query() pagination: PaginationDto) {
    return this.fundraisingService.getAllFundRaise(pagination);
  }

  @Get('get-fundraising-by-id/:id')
  getFundRaiseById(@Param('id') id: string) {
    return this.fundraisingService.getFundRaiseById(id);
  }
}
