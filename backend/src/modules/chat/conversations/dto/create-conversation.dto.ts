import { IsArray, IsString, IsOptional, IsEnum } from 'class-validator';

import { ConversationType } from '../enums/conversation-type.enum';
export class CreateConversationDto {
 @IsEnum(ConversationType)
  type: ConversationType;

    @IsOptional() 
    @IsString()
    title?: string;
    @IsArray()
    members: number[];
}