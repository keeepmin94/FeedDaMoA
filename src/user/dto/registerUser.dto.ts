import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class RegisterUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
    message: 'Only numbers, English, and special characters are allowed for passwords.'
  })
  password: string
}

