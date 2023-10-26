import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../common/decorator/typeorm-ex.module'
import { User } from './entities/user.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        TypeOrmExModule.forCustomRepository([UserRepository])
    ],
    controllers:[UserController],
    providers:[UserService]
})
export class UserModule {}
