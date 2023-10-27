import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmExModule } from 'src/common/decorator/typeorm-ex.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmExModule.forCustomRepository([PostRepository]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
