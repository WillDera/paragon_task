import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
