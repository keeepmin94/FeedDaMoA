import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LogInDto } from './dto/login.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

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
