import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [UserController, PostController, AuthController],
  providers: [PostService, UserService, AuthService],
})
export class AppModule {}
