import { Test, TestingModule } from '@nestjs/testing';
import { GmessageService } from './gmessage.service';

describe('GmessageService', () => {
  let service: GmessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmessageService],
    }).compile();

    service = module.get<GmessageService>(GmessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
