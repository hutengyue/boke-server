import { Test, TestingModule } from '@nestjs/testing';
import { GmessageController } from './gmessage.controller';
import { GmessageService } from './gmessage.service';

describe('GroupController', () => {
  let controller: GmessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmessageController],
      providers: [GmessageService],
    }).compile();

    controller = module.get<GmessageController>(GmessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
