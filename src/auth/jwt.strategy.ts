import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as config from 'config';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 페이로드에 있는 username을 조회하여 user 객체를 return합니다.
  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }

    return user;
  }
}
