import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../../libs/db/AbstractRepo';
import { FundRaiserEntity } from '../entity/fund-raiser.entity';

@Injectable()
export class FundRaiserRepository extends AbstractRepo<FundRaiserEntity> {
  constructor() {
    super(FundRaiserEntity);
  }
}
