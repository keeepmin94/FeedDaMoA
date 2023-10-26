import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../common/decorator/typeorm-ex.module'
import { PassportModule } from '@nestjs/passport';
import * as config from 'config'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

const jwtConfig = config.get('jwt')

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          }
        }),
        TypeOrmExModule.forCustomRepository([UserRepository])
      ],
    controllers:[UserController],
    providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
