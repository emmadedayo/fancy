import { Injectable } from '@nestjs/common';
import { FundRaiserRepository } from './repo/fund-raiser-repo';
import { FundRaiseRepository } from './repo/fund-raise-repo';
import { CreateFundRaisingDto, MakeDonationDto } from './dto/fundraise.dto';
import {
  FundRaisingEntity,
  FundRaisingStatus,
} from './entity/fundraise.entity';
import { BaseResponse } from '../../libs/response/base_response';
import { PaginationDto } from '../../libs/pagination/pagination';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { UserEntity } from '../user/entity/user.entity';
import { PaymentType } from '../../libs/payment/payment-type.enum';
import { FundRaiserEntity } from './entity/fund-raiser.entity';
import { In } from 'typeorm';

@Injectable()
export class FundraisingService {
  constructor(
    private readonly fundRaiserSubscription: FundRaiserRepository,
    private readonly fundRaise: FundRaiseRepository,
    private readonly payStackService: PayStackService,
  ) {}

  async createFundRaiser(user_id: string, data: CreateFundRaisingDto) {
    data['user_id'] = user_id;
    data['slug_url'] = data.title.toLowerCase().replace(/ /g, '-');
    const fund = await this.fundRaise.save(<FundRaisingEntity>data);
    return BaseResponse.success(fund, 'Fundraiser created successfully');
  }

  async getMyFundRaiser(user_id: string, data: PaginationDto) {
    const pageSize = parseInt(data.page, 10);
    const limitInt = parseInt(data.limit, 10);
    //get total fundraise
    const totalFundRaise = await this.fundRaise.sumWithConditions(
      'target_amount',
      {
        user_id: user_id,
        status:
          FundRaisingStatus.IN_PROGRESS ||
          FundRaisingStatus.PENDING ||
          FundRaisingStatus.COMPLETED,
      },
    );
    const subscriptions = await this.fundRaise.findPaginated(
      limitInt,
      pageSize,
      {
        user_id: user_id,
      },
      { created_at: 'DESC' },
    );
    //get id from subscriptions and get total amount from fundRaiserSubscription
    const ids = subscriptions.data.map((sub) => sub.id);
    const totalRaised = await this.fundRaiserSubscription.sumWithConditions(
      'amount',
      {
        fund_raising_id: In(ids),
      },
    );
    // Add totalRaised to each subscription
    subscriptions.data = subscriptions.data.map((sub) => {
      sub['total_raised'] = totalRaised || 0;
      return sub;
    });
    return BaseResponse.success(
      { subscriptions, totalFundRaise },
      'Fundraiser fetched successfully',
    );
  }

  async updateFundRaiser(
    user_id: string,
    data: CreateFundRaisingDto,
    fund_id: string,
  ) {
    const fund = await this.fundRaise.findOne({
      id: fund_id,
      user_id: user_id,
    });
    if (!fund) {
      return BaseResponse.error('Fundraiser not found', null);
    }
    data['slugUrl'] = data.title.toLowerCase().replace(/ /g, '-');
    await this.fundRaise.update({ id: fund_id }, data);
    return BaseResponse.success(null, 'Fundraiser updated successfully');
  }

  async deleteFundRaiser(user_id: string, fund_id: string) {
    const fund = await this.fundRaise.findOne({
      id: fund_id,
      user_id: user_id,
    });
    if (!fund) {
      return BaseResponse.error('Fundraiser not found', null);
    }
    //send to job
    return BaseResponse.success(fund, 'Fundraiser deleted successfully');
  }

  async getFundRaiserById(id: string, user_id: string) {
    const fund = await this.fundRaise.findOne({
      id,
      user_id: user_id,
    });
    const totalRaised = await this.fundRaiserSubscription.sumWithConditions(
      'amount',
      {
        fund_raising_id: fund.id,
      },
    );
    return BaseResponse.success(
      { fund, totalRaised },
      'Fundraiser fetched successfully',
    );
  }

  async stopFundraising(id: string, user_id: string) {
    const fund = await this.fundRaise.findOne({
      id,
      user_id: user_id,
    });
    if (!fund) {
      return BaseResponse.error('Fundraiser not found', null);
    }
    if (fund.status === 'STOP') {
      return BaseResponse.error('Fundraiser already stopped', null);
    }
    fund.status = FundRaisingStatus.STOP;
    await this.fundRaise.save(fund);
    return BaseResponse.success(null, 'Fundraiser stopped successfully');
  }

  async makeDonation(user: UserEntity, data: MakeDonationDto) {
    const fund = await this.fundRaise.findOne({
      id: data.fund_raising_id,
    });
    if (!fund) {
      return BaseResponse.error('Fundraiser not found', null);
    }
    const dataInsert = {
      user_id: user.id,
      fund_raising_id: fund.id,
      amount: data.amount,
    };
    const fundRaiser = await this.fundRaiserSubscription.save(
      <FundRaiserEntity>dataInsert,
    );
    const payStackResponse = await this.payStackService.initializeTransaction(
      user.email,
      data.amount * 100,
      'https://your-callback-url.com',
      {
        fund_raising_id: fund.id,
        fundRaiserId: fundRaiser.id,
        userId: user.id,
        paymentType: PaymentType.DONATION,
        cancel_action: 'https://your-cancel-url.com',
      },
    );

    //get only authorization_url from payStackResponse
    const authorizationUrl = payStackResponse.data.authorization_url;
    return BaseResponse.success(
      { url: authorizationUrl },
      'Payment initialized successfully',
    );
  }

  async getAllFundRaise(data: PaginationDto) {
    const pageSize = parseInt(data.page, 10);
    const limitInt = parseInt(data.limit, 10);
    const fundRaise = await this.fundRaise.findPaginated(
      limitInt,
      pageSize,
      {},
      { created_at: 'DESC' },
    );
    return BaseResponse.success(fundRaise, 'Fundraise fetched successfully');
  }

  async getFundRaiseById(id: string, data: PaginationDto) {
    const pageSize = parseInt(data.page, 10);
    const limitInt = parseInt(data.limit, 10);
    const fund = await this.fundRaiserSubscription.findPaginated(
      limitInt,
      pageSize,
      {
        fund_raising_id: id,
      },
      { created_at: 'DESC' },
    );
    return BaseResponse.success(fund, 'Fundraise fetched successfully');
  }
}
