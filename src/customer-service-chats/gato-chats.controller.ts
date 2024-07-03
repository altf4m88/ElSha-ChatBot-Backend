import { Controller, Get, Post, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { GatoChatsService } from './gato-chats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GatoChatsInterceptor } from 'src/interceptors/gato-chats.interceptor';
import { ChatHistoryInterceptor } from 'src/interceptors/chat-history.interceptor';
import { GetUser } from '../auth/get-user.decorator'; // Import the decorato

@Controller('gato-chats')
export class GatoChatsController {
  constructor(private readonly gatoChatsService: GatoChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GatoChatsInterceptor)
  async sendChat(@Body() body: { message: string }, @GetUser() user: any) {
    return this.gatoChatsService.sendChatToAI(body.message, user);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ChatHistoryInterceptor)
  async getChatHistory(@GetUser() user: any) {
    return this.gatoChatsService.getChatHistory(user);
  }
}
