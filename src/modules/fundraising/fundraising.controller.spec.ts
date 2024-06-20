import { Test, TestingModule } from '@nestjs/testing';
import { FundraisingController } from './fundraising.controller';
import { FundraisingService } from './fundraising.service';

describe('FundraisingController', () => {
  let controller: FundraisingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundraisingController],
      providers: [FundraisingService],
    }).compile();

    controller = module.get<FundraisingController>(FundraisingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
