import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceChatsService } from './customer-service-chats.service';

describe('CustomerServiceChatsService', () => {
  let service: CustomerServiceChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerServiceChatsService],
    }).compile();

    service = module.get<CustomerServiceChatsService>(
      CustomerServiceChatsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
