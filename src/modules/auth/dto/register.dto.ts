import { IsEmail, IsString, MinLength } from 'class-validator';
import { ForbiddenName } from 'src/modules/shared/validators/forbidden-name.validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(2)
  @ForbiddenName()
  name!: string;
}
