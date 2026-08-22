import { Type } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTopicDto {
  @Type(() => Number)
  @IsNumber()
  conversationId: number;

  @IsString()
  @MinLength(1)
  name: string;
}
