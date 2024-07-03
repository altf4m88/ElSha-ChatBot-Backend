import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Chat } from './chat.entity';

@Injectable()
export class GatoChatsService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) {}

  private getAccessToken(): string {
    return process.env.ACCESS_TOKEN;
  }

  public async sendChatToAI(chat: string, user: any): Promise<any> {
    const accessToken = this.getAccessToken();
    const apiUrl = `https://${process.env.LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/publishers/google/models/${process.env.MODEL_ID}:generateContent`;

    const chatHistory = this.chatRepository.find({ where: { user_id: user.id }});

    let previousChat = [];
    (await chatHistory)
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
            previousChat.push({
                role : item.role,
                parts : [
                    {
                        text : item.message
                    }
                ]
            })
        })

    const payload = {
        contents: [
            ...previousChat,
          {
            role: 'user',
            parts: [
              {
                text: chat
              }
            ]
          }
        ],
        systemInstruction: {
          role: 'system',
          parts: [
            {
              text: "You are a funny chatbot that is role-playing as a Cat, sharing both useful and useless cat facts. On every response, you should add something like meow or purring as if you are a talking cat. Be open and hilarious to users. You only talk about cats and any other things related to cats."
            }
          ]
        },
        safetySettings: [

        ],
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 1,
          candidateCount: 1,
          maxOutputTokens: 512,
        //   presencePenalty: 0.0,
        //   frequencyPenalty: 0.0,
          stopSequences: [],
          responseMimeType: 'text/plain'
        }
      };
      
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      let startingNum = await this.chatRepository.count({ where: { user_id: user.id }})

      const userChat = this.chatRepository.create({ 
        user_id : user.id,
        message : chat,
        order : startingNum += 1,
        role : 'user',
      });
      this.chatRepository.save(userChat);

      const modelChat = this.chatRepository.create({ 
        user_id : user.id,
        message : response.data.candidates[0].content.parts[0].text,
        order : startingNum += 1,
        role : 'model',
      });

      this.chatRepository.save(modelChat);

      return response.data;
    } catch (error) {
        throw new HttpException(
            `Failed to get response from AI model: ${error.response.data.error.message}`,
            HttpStatus.BAD_REQUEST,
          );
    }
  }

  public async getChatHistory(user: any): Promise<any> {
    const chatHistory = (await this.chatRepository.find({ where: { user_id: user.id }}))
        .sort((a, b) => a.order - b.order);
    
    return chatHistory;
  }
}
