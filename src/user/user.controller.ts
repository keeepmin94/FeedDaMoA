import { Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto): Promise<object> {
        return this.userService.signUp(registerUserDto)
    }
}
