import { Injectable }
from '@nestjs/common';

import { SendMessageDto }
from '../dto/send-message.dto';

import { SendMessageUseCase }
from '../application/send-message.usecase';

import { GetMessagesUseCase }
from '../application/get-messages.usecase';

@Injectable()
export class MessageService {

  constructor(

    private readonly sendMessageUseCase: SendMessageUseCase,

    private readonly getMessagesUseCase:
    GetMessagesUseCase,

  ) {}

  async sendMessage(

    dto: SendMessageDto,

    userId:number,

  ){

    return await

    this.sendMessageUseCase.execute(

        dto,

        userId,

    );

  }


  async getMessageByTopic(

      topicId:number,

      userId:number,

  ){

      return await

      this.getMessagesUseCase.execute(

          topicId,

          userId,

      );

  }

}
