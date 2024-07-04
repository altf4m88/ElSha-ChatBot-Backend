import { Module } from '@nestjs/common';
import { CustomerServiceChatsController } from './customer-service-chats.controller';
import { CustomerServiceChatsService } from './customer-service-chats.service';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [CustomerServiceChatsController],
  providers: [CustomerServiceChatsService],
})
export class CustomerServiceChatsModule {}
