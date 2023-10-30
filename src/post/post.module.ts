import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module';
import { PostRepository } from './post.repository';
import { HttpModule } from '@nestjs/axios';
import { APP_PIPE } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmExModule.forCustomRepository([PostRepository]),
    HttpModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [PostService],
})
export class PostModule {}
