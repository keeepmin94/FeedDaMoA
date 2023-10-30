import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

// 회원가입 DTO
export class RegisterUserDto {
  @ApiProperty({ description: '계정' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: '이메일' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MinLength(10, { message: '최소 10자리 이상 작성해야 합니다.' })
  @MaxLength(20)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
    message: '숫자, 영어, 특수문자를 사용하여 작성해야합니다.',
  })
  password: string;

  @ApiProperty({ description: `인증코드(''으로 보내면 돼요)` })
  @IsOptional()
  verificationCode: string;

  @ApiProperty({ description: `가입 승인 여부('' 으로 보내면 돼요)` })
  @IsOptional()
  isVerified: boolean;
}
