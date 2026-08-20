import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendMessageDto {
  @Type(() => Number)
  @IsNumber()
  conversationId: number;

  @Type(() => Number)
  @IsNumber()
  topicId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type?: number;
}