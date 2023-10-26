import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
      private jwtService: JwtService
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

    async signIn(logIntDto: LogInDto): Promise<{accessToken: string}> {
        const {username, password} = logIntDto
        const user = await this.userRepository.findOne({where: {username}})
    
        if (user && (await bcrypt.compare(password, user.password))) {
          // 유저 토큰 생성(Secret + Payload)
          const payload = { username }
          const accessToken = this.jwtService.sign(payload)
          return { accessToken }
        } else {
          throw new UnauthorizedException('로그인 실패')
        }
      }
}
