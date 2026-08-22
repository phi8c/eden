import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ToggleMessageReactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  reaction: string;
}
