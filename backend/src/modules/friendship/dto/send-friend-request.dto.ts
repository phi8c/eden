import { IsNumber } from 'class-validator';

export class SendFriendRequestDto {
  @IsNumber()
  targetUserId: number;
}
