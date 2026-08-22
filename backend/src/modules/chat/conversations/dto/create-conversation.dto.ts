import {
  IsArray,
  IsString,
  IsOptional,
  IsEnum,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ConversationType } from '../enums/conversation-type.enum';
export class CreateConversationDto {
  @Transform(({ value }) => {
    if (value === 'private') {
      return ConversationType.PRIVATE;
    }

    if (value === 'group') {
      return ConversationType.GROUP;
    }

    return value;
  })
  @IsEnum(ConversationType)
  type: ConversationType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({}, { each: true })
  memberIds: number[];
}
