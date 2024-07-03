import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceChatsController } from './customer-service-chats.controller';

describe('CustomerServiceChatsController', () => {
  let controller: CustomerServiceChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServiceChatsController],
    }).compile();

    controller = module.get<CustomerServiceChatsController>(CustomerServiceChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
