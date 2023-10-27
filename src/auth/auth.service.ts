import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { EmailService } from '../auth/email.service';
import { LogInDto } from './dto/login.dto';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // 로그인
  async logIn(logIntDto: LogInDto): Promise<{ accessToken: string }> {
    try {
      const { username, password } = logIntDto;
      const user = await this.userRepository.findByUsername(username);

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException('로그인 실패');
      }
    } catch (error) {
      throw new InternalServerErrorException('로그인 중 에러가 발생했습니다.');
    }
  }

  // 인증코드 랜덤 6자리 생성
  async generateVerificationCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 이메일로 인증코드 보내기
  async sendVerificationCode(user: User): Promise<void> {
    try {
      const verificationCode = await this.generateVerificationCode();

      user.verificationCode = verificationCode;

      await this.userRepository.save(user);

      return await this.emailService.sendVerificationToEmail(
        user.email,
        verificationCode,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        '인증 코드를 이메일로 전송 중 에러가 발생했습니다.',
      );
    }
  }

  // 인증코드 확인
  async confirmVerificationCode(verificationCode: string, user: User) {
    try {
      const savedCode = user.verificationCode;

      if (!savedCode) {
        throw new BadRequestException('저장된 인증 코드가 없습니다.');
      }

      if (savedCode !== verificationCode) {
        throw new BadRequestException('인증 코드가 일치하지 않습니다.');
      }

      await this.userRepository.isVerfied(verificationCode, user);
      await this.clearVerificationCode(user);

      return { message: '인증 코드가 확인되었습니다.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        '인증 코드 확인 중 오류가 발생했습니다.',
      );
    }
  }

  // 인증코드 제거
  async clearVerificationCode(user: User): Promise<void> {
    try {
      const userId = await this.userRepository.findById(user.id);

      if (!userId) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      await this.userRepository.clearVerificationCode(
        user.email,
        user.verificationCode,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        '인증 코드 제거 중 오류가 발생했습니다.',
      );
    }
  }
}
