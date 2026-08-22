import {
  Allow,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @Type(() => Number)
  @IsNumber()
  conversationId: number;

  @Type(() => Number)
  @IsNumber()
  topicId: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @IsObject()
  metadata?: Record<string, unknown>;

  @Allow()
  @IsOptional()
  files?: unknown;
}
