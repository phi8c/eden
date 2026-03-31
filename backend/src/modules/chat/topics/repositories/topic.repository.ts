import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Topic } from '../entities/topic.entity';

@Injectable()
export class TopicRepository {
    constructor(
@InjectRepository(Topic) 
private readonly topicRepo: Repository<Topic>,
    ){}

    async create(data: Partial<Topic>) {
        return this.topicRepo.save(data);

    }

    async findByConversationId(conversationId: number) {
        return this.topicRepo.findOne({
            where: {conversation_id: conversationId},
            order: {id: 'ASC'},
        });
    }
    async findById(id: number) {
        return this.topicRepo.findOne({
            where: {id},
        });
    }
}