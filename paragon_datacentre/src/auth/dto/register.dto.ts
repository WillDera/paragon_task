import { IsNotEmpty, MinLength, IsStrongPassword } from 'class-validator';
import { IsUserAlreadyExist } from '../../common/decorator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsUserAlreadyExist({
    message: 'Username $value unavailable.',
  })
  @MinLength(5)
  username: string;

  @IsStrongPassword()
  @MinLength(6)
  password: string;
}
