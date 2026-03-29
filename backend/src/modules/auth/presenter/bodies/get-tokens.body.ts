import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class GetTokensBody {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
