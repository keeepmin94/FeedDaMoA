import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  // 회원가입
  async signUp(registerUserDto: RegisterUserDto): Promise<object> {
    const { username, email, password, verificationCode, isVerified } =
      registerUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      username,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified,
    };
    try {
      await this.userRepository.createUser(user);

      return { message: '회원가입에 성공했습니다' };
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        throw new ConflictException('존재하는 유저 이름입니다.');
      }
      throw new InternalServerErrorException('회원가입에 실패 했습니다.');
    }
  }
}
