import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(registerUserDto: RegisterUserDto): Promise<object> {
    try {
      await this.userRepository.createUser(registerUserDto);

      return { message: '회원가입에 성공했습니다' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('회원가입에 실패 했습니다.');
    }
  }
}
