import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Config } from '../../../config';
import { Logger } from '@nestjs/common';
import { FirebaseService } from '../../../libs/notification/firebase/firebase.service';

@Processor(Config.UPDATE_USER_CONSUMER)
export class UpdateUserConsumer {
  private readonly logger = new Logger(UpdateUserConsumer.name);
  constructor(private readonly firebaseService: FirebaseService) {}
  @Process()
  async transcode(job: Job<unknown>) {
    this.logger.debug('Started processing send email queue');
    console.log(job.data['user']);
    await this.firebaseService.createUser(job.data['user']);
    this.logger.debug('Finished processing send email queue');
  }
}
