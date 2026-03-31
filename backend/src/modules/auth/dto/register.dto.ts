import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {

  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(100)
  password: string;

}