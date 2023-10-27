import { Repository } from 'typeorm';
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator';
import { Post } from './entities/post.entity';
// import { Tag } from './entities/tag.entity';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPostById(id: string): Promise<Post> {
    return await this.createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.tags', 'tags')
      .getOne();
  }

  async findPostByHashtag(hashTag: string) {
    console.log(hashTag);
    return await this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .where('tags.tag = :hashTag', { hashTag })
      .getRawMany();
  }
}
