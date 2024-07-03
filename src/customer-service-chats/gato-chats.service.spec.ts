import { Test, TestingModule } from '@nestjs/testing';
import { GatoChatsService } from './gato-chats.service';

describe('GatoChatsService', () => {
  let service: GatoChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatoChatsService],
    }).compile();

    service = module.get<GatoChatsService>(GatoChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
