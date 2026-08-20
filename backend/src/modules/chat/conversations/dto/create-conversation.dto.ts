import {
  IsArray,
  IsString,
  IsOptional,
  IsEnum,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';

import { ConversationType } from '../enums/conversation-type.enum';
export class CreateConversationDto {
  @IsEnum(ConversationType)
  type: ConversationType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsArray()
  @IsNumber({}, { each: true })
  memberIds: number[];
}
