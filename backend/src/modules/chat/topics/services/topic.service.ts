
import { Injectable, BadRequestException } from '@nestjs/common';
import { TopicRepository } from '../repositories/topic.repository';
import { CreateTopicDto } from '../dto/create-topic.dto';

@Injectable()
export class TopicService {
    constructor(
     
    private readonly topicRepo: TopicRepository,

    ){}

    async createTopic(dto: CreateTopicDto, userId: number) {
        if(!dto.name) {
            throw new BadRequestException('Topic name is required');

        }
        return this.topicRepo.create({
            name: dto.name,
            conversation_id: dto.conversationId,
            created_by: userId,
        });
    }
    async getTopics(conversationId: number) {
        return this.topicRepo.findByConversationId(conversationId)
       

        
    }
     async createDefaultTopic(conversationId: number) {
    return this.topicRepo.create({
      name: 'General',
      conversation_id: conversationId,
    });
  }
    
}