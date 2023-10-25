import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
    ){}

    async signUp(registerUserDto: RegisterUserDto): Promise<void>{
        try {
            return await this.userRepository.createUser(registerUserDto);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}
