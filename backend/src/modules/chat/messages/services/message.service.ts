import { Injectable }
from '@nestjs/common';

import { SendMessageDto }
from '../dto/send-message.dto';

import { SendMessageUseCase }
from '../application/send-message.usecase';

import { GetMessagesUseCase }
from '../application/get-messages.usecase';
import { ToggleMessageReactionUseCase }
from '../application/toggle-message-reaction.usecase';

@Injectable()
export class MessageService {

  constructor(

    private readonly sendMessageUseCase: SendMessageUseCase,

    private readonly getMessagesUseCase:
    GetMessagesUseCase,

    private readonly toggleReactionUseCase:
    ToggleMessageReactionUseCase,

  ) {}

  async sendMessage(

    dto: SendMessageDto,

    userId:number,

    files: Express.Multer.File[] = [],

  ){

    return await

    this.sendMessageUseCase.execute(

        dto,

        userId,

        files,

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

  async toggleReaction(
    messageId: number,
    userId: number,
    reaction: string,
  ){
      return this.toggleReactionUseCase.execute(
          messageId,
          userId,
          reaction,
      );
  }

}
