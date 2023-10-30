import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { LogInDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  @HttpCode(200)
  logIn(
    @Body(ValidationPipe) logInDto: LogInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.logIn(logInDto);
  }

  @ApiOperation({
    summary: '인증 메일',
    description: '유저의 이메일로 인증 메일을 보냅니다.',
  })
  @Post('/verify-email')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  sendCode(@GetUser() user: User): Promise<void> {
    return this.authService.sendVerificationCode(user);
  }

  @ApiOperation({ summary: '유저 인증코드 확인' })
  @Post('/confirmcode')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  confirmCode(
    @Body('verificationCode') verificationCode: string,
    @GetUser() user: User,
  ): Promise<object> {
    return this.authService.confirmVerificationCode(verificationCode, user);
  }
}
