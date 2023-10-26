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
    async generateRandomNumber(): Promise<number> {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    async signUp(registerUserDto: RegisterUserDto): Promise<object>{
        try {
            const randomCode = this.generateRandomNumber()
            await this.userRepository.createUser(registerUserDto)
            
            return {
                message: '회원가입에 성공했습니다',
                randomCode
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}
