import { Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LogInDto } from './dto/login.dto';


@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto): Promise<object> {
        return this.userService.signUp(registerUserDto)
    }

    @Post('/email-verify')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<object> {
        const { signUpVerifyCode } = verifyEmailDto
        return await this.userService.verifyEmail(signUpVerifyCode)
    }

    @Post('/signin')
  signIn(@Body(ValidationPipe) logInDto: LogInDto): Promise<{ accessToken: string }> {
    return this.userService.signIn(logInDto)
  }
}
