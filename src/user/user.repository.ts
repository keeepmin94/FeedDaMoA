import { Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(registerUserDto: RegisterUserDto): Promise<void> {
    const { username, email, password, verificationCode, isVerified } =
      registerUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('존재하는 유저 이름입니다.');
      }
      throw new InternalServerErrorException('회원가입에 실패한 것인가!!!!');
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.findOne({ where: { username } });

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });

    return user;
  }

  async isVerfied(verificationCode: string, user: User): Promise<void> {
    try {
      user.verificationCode = verificationCode;
      user.isVerified = true;

      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        '인증 코드 확인 중 오류가 발생했습니다.',
      );
    }
  }

  async clearVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    try {
      const user = await this.findOne({ where: { email, verificationCode } });

      user.verificationCode = '';

      await this.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        '인증 코드 제거 중 오류가 발생했습니다.',
      );
    }
  }
}
