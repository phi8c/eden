import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

}