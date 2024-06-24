import { Module } from '@nestjs/common';
import { FundraisingService } from './fundraising.service';
import { FundraisingController } from './fundraising.controller';
import { FundRaiseRepository } from './repo/fund-raise-repo';
import { FundRaiserRepository } from './repo/fund-raiser-repo';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';

@Module({
  controllers: [FundraisingController],
  providers: [
    FundraisingService,
    FundRaiseRepository,
    FundRaiserRepository,
    PayStackService,
  ],
})
export class FundraisingModule {}
