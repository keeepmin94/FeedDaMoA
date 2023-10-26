import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findOne(postId: string): Promise<Post> {
    // 게시글 상세 정보 조회, 조회수 + 1
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException(`${postId} not found.`);
    }

    post.viewCount += 1;
    await this.postRepository.save(post);
    return post;
  }
}
