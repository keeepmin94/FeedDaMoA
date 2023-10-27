import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LogInDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<object> {
    return this.userService.signUp(registerUserDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) logInDto: LogInDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(logInDto);
  }

  @Post('/sendcode')
  @UseGuards(AuthGuard())
  sendCode(@GetUser() user: User): Promise<void> {
    return this.userService.sendVerificationCode(user);
  }

  @Post('/confirmcode')
  @UseGuards(AuthGuard())
  confirmCode(
    @Body('verificationCode') verificationCode: string,
    @GetUser() user: User,
  ): Promise<object> {
    return this.userService.confirmVerificationCode(verificationCode, user);
  }
}
