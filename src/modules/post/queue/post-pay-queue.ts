import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Config } from '../../../config';
import { FirebaseService } from '../../../libs/notification/firebase/firebase.service';
import { UserTransactionRepository } from '../../user/repositories/user_transaction.repository';
import { UserWalletRepository } from '../../user/repositories/user_wallet.repository';
import { PostPaidRepository } from '../repos/post-paid-repository';
import {
  TransactionStatus,
  TransactionType,
  Type,
} from '../../user/entity/user_transaction.entity';

@Processor(Config.POST_PAY)
export class PostPayQueue {
  constructor(
    private readonly userSubscriptionRepository: UserTransactionRepository,
    private readonly userWalletRepository: UserWalletRepository,
    private readonly postPaidViewRepository: PostPaidRepository,
    private readonly firebase: FirebaseService,
  ) {}
  private readonly logger = new Logger(PostPayQueue.name);
  @Process()
  async transcode(job) {
    this.logger.debug('Started processing post notification queue');
    const { data } = job;
    const user_details = await this.userWalletRepository.findOne({
      user_id: data.user.id,
    });
    user_details.balance -= Number(data.post.tips_amount);
    await this.userWalletRepository.save(user_details);

    const creator = await this.userWalletRepository.findOne({
      user_id: data.post.user_id,
    });
    // Add the amount to the creator's balance
    creator.earn_balance += Number(data.post.tips_amount);
    await this.userWalletRepository.save(creator);

    await this.userSubscriptionRepository.save({
      user_id: data.user.id,
      amount: Number(data.post.tips_amount),
      reasons: TransactionType.CONTENT_PAYMENT,
      type: Type.DEBIT,
      description: 'Content payment',
      status: TransactionStatus.COMPLETED,
    });

    await this.userSubscriptionRepository.save({
      user_id: data.post.user_id,
      amount: Number(data.post.tips_amount),
      reasons: TransactionType.CONTENT_PAYMENT,
      type: Type.CREDIT,
      description: 'Content payment',
      status: TransactionStatus.COMPLETED,
    });

    await this.postPaidViewRepository.save({
      post_id: data.post.id,
      user_id: data.user.id,
      amount: Number(data.post.tips_amount),
      initial_amount: Number(data.post.tips_amount),
    });

    this.logger.debug('Finished processing post notification queue');
  }
}
