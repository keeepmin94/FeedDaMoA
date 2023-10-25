import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService){}

  @Post('/signin')
  signIn(@Body(ValidationPipe) logInDto: LogInDto): Promise<{ accessToken: string }> {
    return this.authservice.signIn(logInDto)
  }
}
