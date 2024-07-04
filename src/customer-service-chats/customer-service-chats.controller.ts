import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { CustomerServiceChatsService } from './customer-service-chats.service';
import { CustomerChatInterceptor } from 'src/interceptors/customer-chat.interceptor';
import { ChatHistoryInterceptor } from 'src/interceptors/chat-history.interceptor';

@Controller('chats')
export class CustomerServiceChatsController {
  constructor(
    private readonly customerServiceChatsService: CustomerServiceChatsService,
  ) {}

  @Post()
  @UseInterceptors(CustomerChatInterceptor)
  async sendChat(@Body() body: { message: string }) {
    return this.customerServiceChatsService.sendChatToAI(body.message);
  }

  @Get()
  @UseInterceptors(ChatHistoryInterceptor)
  async getChatHistory() {
    return this.customerServiceChatsService.getChatHistory();
  }

  @Delete()
  async deleteChatHistory() {
    return this.customerServiceChatsService.clearChat();
  }
}
