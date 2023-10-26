import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    PostModule,
    AuthModule,
  ],
})
export class AppModule {}
