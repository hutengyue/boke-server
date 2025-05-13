import { Test, TestingModule } from '@nestjs/testing';
import { PmessageController } from './pmessage.controller';
import { PmessageService } from './pmessage.service';

describe('PmessageController', () => {
  let controller: PmessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmessageController],
      providers: [PmessageService],
    }).compile();

    controller = module.get<PmessageController>(PmessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
