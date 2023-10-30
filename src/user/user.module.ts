import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../common/decorator/typeorm-ex.module';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [TypeOrmExModule],
})
export class UserModule {}
