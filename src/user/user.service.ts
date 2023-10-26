import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { EmailService } from './email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async generateVerificationCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signUp(registerUserDto: RegisterUserDto): Promise<object> {
    try {
      await this.userRepository.createUser(registerUserDto);

      return { message: '회원가입에 성공했습니다' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('회원가입에 실패 했습니다.');
    }
  }

  async signIn(logIntDto: LogInDto): Promise<{ accessToken: string }> {
    const { username, password } = logIntDto;
    const user = await this.userRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 실패');
    }
  }

  async sendVerificationCode(user: User): Promise<void> {
    const verificationCode = await this.generateVerificationCode();

    user.verificationCode = verificationCode;

    await this.userRepository.save(user);

    return await this.emailService.sendVerificationToEmail(
      user.email,
      verificationCode,
    );
  }

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

  async clearVerificationCode(user: User): Promise<void> {
    const userId = await this.userRepository.findById(user.id);

    if (!userId) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.clearVerificationCode(
      user.email,
      user.verificationCode,
    );
  }
}
