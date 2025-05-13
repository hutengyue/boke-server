import { Test, TestingModule } from '@nestjs/testing';
import { PmessageService } from './pmessage.service';

describe('PmessageService', () => {
  let service: PmessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmessageService],
    }).compile();

    service = module.get<PmessageService>(PmessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
