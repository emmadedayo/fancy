import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { FundRaisingEntity } from '../entity/fundraise.entity';

@Injectable()
export class FundRaiseRepository extends AbstractRepo<FundRaisingEntity> {
  constructor() {
    super(FundRaisingEntity);
  }
}
