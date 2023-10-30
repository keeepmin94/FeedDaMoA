import { Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  // 유저 생성
  async createUser(user: RegisterUserDto): Promise<void> {
    await this.save(user);
  }

  // username으로 유저 찾기
  async findByUsername(username: string): Promise<User> {
    const user = await this.findOne({ where: { username } });

    return user;
  }

  // id로 유저 찾기
  async findById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id } });

    return user;
  }

  // 가입 승인
  async isVerfied(verificationCode: string, user: User): Promise<void> {
    user.verificationCode = verificationCode;
    user.isVerified = true;

    await this.save(user);
  }

  // 인증코드 제거
  async clearVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const user = await this.findOne({ where: { email, verificationCode } });

    user.verificationCode = '';

    await this.save(user);
  }
}
