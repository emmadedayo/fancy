import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserFollowerRepository } from './repositories/user_follower_repository';
import { PayStackService } from '../../libs/payment/paystack/paystack.service';
import { PaginationDto } from '../../libs/pagination/pagination';
import { BaseResponse } from '../../libs/response/base_response';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFollowerRepository: UserFollowerRepository,
    private readonly payStackService: PayStackService,
  ) {}

  async getAllUsers(data: PaginationDto) {
    const pageSize = parseInt(data.limit, 10) || 10;
    const currentPage = parseInt(data.page, 10) || 1;
    let where = {};
    if (data.is_creator) {
      where = { is_creator: true };
    }
    const users = await this.userRepository.findPaginated(
      pageSize,
      currentPage,
      where,
      { created_at: 'DESC' },
    );
    return BaseResponse.success(
      users,
      'Users fetched successfully',
      HttpStatus.OK,
    );
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ id }, { wallet: true });
    return BaseResponse.success(
      user,
      'User fetched successfully',
      HttpStatus.OK,
    );
  }

  async disableUser(id: string) {
    await this.userRepository.findOneAndUpdate(
      { id },
      { is_active: false, account_status: 'ban' },
    );
    return BaseResponse.success(
      null,
      'User disabled successfully',
      HttpStatus.OK,
    );
  }

  async enableUser(id: string) {
    await this.userRepository.findOneAndUpdate(
      { id },
      { is_active: true, account_status: 'active' },
    );
    return BaseResponse.success(
      null,
      'User enabled successfully',
      HttpStatus.OK,
    );
  }

  async approveCreator(id: string) {
    await this.userRepository.findOneAndUpdate(
      { id },
      { creator: 'approved', is_creator: true },
    );
    return BaseResponse.success(
      null,
      'User approved as creator successfully',
      HttpStatus.OK,
    );
  }

  async disableCreator(id: string) {
    await this.userRepository.findOneAndUpdate(
      { id },
      { creator: 'disapproved', is_creator: false },
    );
    return BaseResponse.success(
      null,
      'User disapproved as creator successfully',
      HttpStatus.OK,
    );
  }
}
