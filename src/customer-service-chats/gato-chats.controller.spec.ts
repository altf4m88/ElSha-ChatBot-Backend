import { Test, TestingModule } from '@nestjs/testing';
import { GatoChatsController } from './gato-chats.controller';

describe('GatoChatsController', () => {
  let controller: GatoChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatoChatsController],
    }).compile();

    controller = module.get<GatoChatsController>(GatoChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
