import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TopicService } from '../services/topic.service';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { AuthGuard } from '../../../../guards/jwt-auth.guard';


@Controller('topics') 
export class TopicController {
    constructor(
        private readonly topicService: TopicService,
    ){}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() dto: CreateTopicDto, @Req() req) {
        return this.topicService.createTopic(dto, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Get('conversation/:id')
    getByConversation(@Param('id') id: number) {
        return this.topicService.getTopics(Number(id));
    }
}
