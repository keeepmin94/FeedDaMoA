import { Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { Post } from './entities/post.entity';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPostById(id: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.tags', 'tags')
      .getOne();
  }
}
