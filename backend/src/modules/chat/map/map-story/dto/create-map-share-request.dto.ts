import { IsIn } from 'class-validator';

export class CreateMapShareRequestDto {
  @IsIn([60, 120, 360])
  durationMinutes: 60 | 120 | 360;
}
