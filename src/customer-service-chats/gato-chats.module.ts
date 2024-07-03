import { Module } from '@nestjs/common';
import { GatoChatsController } from './gato-chats.controller';
import { GatoChatsService } from './gato-chats.service';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [GatoChatsController],
  providers: [GatoChatsService]

})
export class GatoChatsModule {}
