import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Chat } from './chat.entity';

@Injectable()
export class CustomerServiceChatsService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) {}

  private getAccessToken(): string {
    return process.env.ACCESS_TOKEN;
  }

  public async sendChatToAI(chat: string): Promise<any> {
    const accessToken = this.getAccessToken();
    const apiUrl = `https://${process.env.LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/publishers/google/models/${process.env.MODEL_ID}:generateContent`;

    const chatHistory = this.chatRepository.find();

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
              text: "Your name is ElSha, you are a Sharia-based finance assurance customer service chatbot. You will help users with their issues regarding finance topics. Be helpful and informative. Keep in mind that you refuse to talk about any other topics. You only response in Bahasa Indonesia"
            }
          ]
        },
        safetySettings: [
          {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_LOW_AND_ABOVE',
          },
          {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_LOW_AND_ABOVE',
          },
          {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_LOW_AND_ABOVE',
          },
          {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_LOW_AND_ABOVE',
          }
        ],
        generationConfig: {
          temperature: 0.5,
          topP: 1,
          topK: 1,
          candidateCount: 1,
          maxOutputTokens: 1024,
        //   presencePenalty: 0.0,
        //   frequencyPenalty: 0.0,
          stopSequences: [],
          responseMimeType: 'text/plain'
        },
        tools: [
          {
            googleSearchRetrieval: {
              disableAttribution: false,
            },
          },
        ],
      };
      
      console.log(payload);
      
    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      let startingNum = await this.chatRepository.count()

      const userChat = this.chatRepository.create({ 
        // user_id : user.id,
        message : chat,
        order : startingNum += 1,
        role : 'user',
      });
      this.chatRepository.save(userChat);

      const modelChat = this.chatRepository.create({ 
        // user_id : user.id,
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

  public async getChatHistory(): Promise<any> {
    const chatHistory = (await this.chatRepository.find()).sort((a, b) => a.order - b.order);
    
    return chatHistory;
  }

  public async clearChat(): Promise<any> {
    await this.chatRepository.clear();

    return 'OK';
  }
}
